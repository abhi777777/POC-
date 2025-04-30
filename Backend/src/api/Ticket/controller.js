const jwt = require("jsonwebtoken");
const { Ticket, PendingTicket } = require("./model");
const { verifyToken } = require("../../services/jwt/index");
const { sendOTP } = require("../../services/nodemailer/index");
function getUserFromToken(req) {
  const token = req.cookies?.token;
  if (!token) {
    const err = new Error("No token found");
    err.status = 401;
    throw err;
  }

  let payload;
  try {
    payload = jwt.decode(token);
  } catch (e) {
    throw Object.assign(new Error("Invalid token format"), { status: 401 });
  }

  try {
    return verifyToken(token, payload.role);
  } catch (err) {
    err.status = 401;
    throw err;
  }
}
exports.authenticate = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "No token provided." });

  try {
    let payload = jwt.decode(token);
    payload = verifyToken(token, payload.role);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: " + err.message });
  }
};

exports.raiseticket = async (req, res) => {
  console.log("[raiseticket] body:", req.body);
  console.log("[raiseticket] cookies:", req.cookies);

  // Authenticate user
  let user;
  try {
    user = getUserFromToken(req);
  } catch (authErr) {
    console.error("[raiseticket] auth error:", authErr);
    return res.status(authErr.status || 401).json({ error: authErr.message });
  }

  //  Extract & validate incoming data
  const {
    name,
    email,
    phoneNumber,
    subject,
    description,
    newName,
    newAddress,
    newPhoneNumber,
    pdfUrl,
  } = req.body;

  if (!pdfUrl) {
    return res.status(400).json({ error: "pdfUrl is required." });
  }

  //  Generate & send OTP
  let otp;
  try {
    otp = await sendOTP(email);
    console.log("[raiseticket] OTP sent:", otp);
  } catch (otpErr) {
    console.error("[raiseticket] sendOTP error:", otpErr);
    return res.status(500).json({ error: "Unable to send OTP." });
  }

  //  Build ticketData payload
  const ticketData = {
    name,
    email,
    phoneNumber,
    subject,
    description,
    pdfUrl,
    ...(newName && { newName }),
    ...(newAddress && { newAddress }),
    ...(newPhoneNumber && { newPhoneNumber }),
    createdBy: user.id,
  };

  //  Save a pending ticket
  try {
    const pendingTicket = new PendingTicket({
      ticketData,
      email,
      otp,
      otpSentAt: new Date(),
      otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await pendingTicket.save();
    console.log("[raiseticket] pendingTicket saved, id:", pendingTicket._id);

    return res.status(200).json({
      message: "OTP sent to your email. Please verify to raise the ticket.",
      pendingTicketId: pendingTicket._id,
    });
  } catch (dbErr) {
    console.error("[raiseticket] DB save error:", dbErr);
    return res.status(500).json({ error: "Database write failed." });
  }
};

exports.verifyTicket = async (req, res) => {
  console.log("[verifyTicket] body:", req.body);

  const { pendingTicketId, email, otp } = req.body;
  if (!pendingTicketId || !email || !otp) {
    console.warn("[verifyTicket] missing fields");
    return res.status(400).json({ error: "Missing required fields." });
  }

  //  Fetch pending ticket
  let pendingTicket;
  try {
    pendingTicket = await PendingTicket.findById(pendingTicketId);
    console.log("[verifyTicket] pendingTicket:", pendingTicket);
  } catch (fetchErr) {
    console.error("[verifyTicket] DB fetch error:", fetchErr);
    return res.status(500).json({ error: "Database fetch failed." });
  }
  if (!pendingTicket) {
    console.warn("[verifyTicket] pendingTicket not found");
    return res.status(404).json({ error: "Pending ticket not found." });
  }

  //  Validate email & OTP
  if (pendingTicket.email !== email || pendingTicket.otp !== otp) {
    console.warn("[verifyTicket] OTP mismatch", {
      expected: { email: pendingTicket.email, otp: pendingTicket.otp },
      actual: { email, otp },
    });
    return res.status(400).json({ error: "OTP verification failed." });
  }

  //  Check expiration
  if (pendingTicket.otpExpiresAt < new Date()) {
    console.warn("[verifyTicket] OTP expired at", pendingTicket.otpExpiresAt);
    return res.status(400).json({ error: "OTP has expired." });
  }

  //  Persist final ticket
  console.log(
    "[verifyTicket] ticketData being saved:",
    pendingTicket.ticketData
  );
  let newTicket;
  try {
    newTicket = new Ticket(pendingTicket.ticketData);
    await newTicket.save();
    console.log("[verifyTicket] newTicket saved:", newTicket._id);
  } catch (saveErr) {
    console.error("[verifyTicket] Ticket.save error:", saveErr);
    const message =
      saveErr.name === "ValidationError"
        ? Object.values(saveErr.errors)
            .map((e) => e.message)
            .join("; ")
        : "Failed to save ticket";
    return res.status(500).json({ error: message });
  }

  // Clean up pending
  try {
    await PendingTicket.findByIdAndDelete(pendingTicketId);
    console.log("[verifyTicket] PendingTicket deleted:", pendingTicketId);
  } catch (delErr) {
    console.error("[verifyTicket] PendingTicket.delete error:", delErr);
  }

  return res.status(201).json({
    message: "Ticket raised successfully and email verified.",
    ticket: newTicket,
  });
};
