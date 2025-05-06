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

  // For update-only tickets (processing from UpdateForm component)
  if (req.body.updates) {
    // Handle update-only ticket (no base ticket information required)
    const { updates } = req.body;

    // Validate that we have at least one update
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No updates provided." });
    }

    // Extract update fields
    const {
      newName,
      nameProofUrl,
      newAddress,
      addressProofUrl,
      newPhoneNumber,
      phoneProofUrl,
    } = updates;

    // Validate proof documents for provided updates
    if (
      (newName && !nameProofUrl) ||
      (newAddress && !addressProofUrl) ||
      (newPhoneNumber && !phoneProofUrl)
    ) {
      return res
        .status(400)
        .json({ error: "Each update field requires a proof document." });
    }

    // Validate newPhoneNumber if provided
    if (newPhoneNumber && !/^\d{10}$/.test(newPhoneNumber)) {
      return res
        .status(400)
        .json({ error: "New phone number must be 10 digits." });
    }

    // For update-only tickets, use default values for required fields
    const ticketData = {
      name: updates.name || user.name || "Update Request",
      email: user.email, // Use user's email for OTP verification
      phoneNumber: updates.phoneNumber || user.phoneNumber || "0000000000",
      pdfUrl: updates.pdfUrl || "default-placeholder-url",
      createdBy: user.id,
    };

    // Add update fields
    if (newName) {
      ticketData.newName = newName;
      ticketData.nameProofUrl = nameProofUrl;
    }

    if (newAddress) {
      ticketData.newAddress = newAddress;
      ticketData.addressProofUrl = addressProofUrl;
    }

    if (newPhoneNumber) {
      ticketData.newPhoneNumber = newPhoneNumber;
      ticketData.phoneProofUrl = phoneProofUrl;
    }

    // Generate & send OTP for update request
    let otp;
    try {
      otp = await sendOTP(user.email);
      console.log("[raiseticket] OTP sent for update:", otp);
    } catch (otpErr) {
      console.error("[raiseticket] sendOTP error:", otpErr);
      return res
        .status(500)
        .json({ error: "Unable to send OTP for verification." });
    }

    // Save as pending ticket that requires OTP verification
    try {
      const pendingTicket = new PendingTicket({
        ticketData,
        email: user.email,
        otp,
        otpSentAt: new Date(),
        otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
        attempts: 0,
        maxAttempts: 3,
      });
      await pendingTicket.save();
      console.log(
        "[raiseticket] pendingTicket saved for update, id:",
        pendingTicket._id
      );

      return res.status(200).json({
        message:
          "OTP sent to your email. Please verify to submit your update request.",
        pendingTicketId: pendingTicket._id,
      });
    } catch (dbErr) {
      console.error("[raiseticket] DB save error:", dbErr);
      return res.status(500).json({ error: "Database write failed." });
    }
  }

  // Regular full ticket creation flow
  const {
    name,
    email,
    phoneNumber,
    pdfUrl,
    // Update fields from UpdateForm
    newName,
    nameProofUrl,
    newAddress,
    addressProofUrl,
    newPhoneNumber,
    phoneProofUrl,
  } = req.body;

  // Validate required fields
  if (!name || !email || !phoneNumber || !pdfUrl) {
    return res.status(400).json({ error: "Required fields missing." });
  }

  // Validate phone number format
  if (!/^\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({ error: "Phone number must be 10 digits." });
  }

  // Validate newPhoneNumber if provided
  if (newPhoneNumber && !/^\d{10}$/.test(newPhoneNumber)) {
    return res
      .status(400)
      .json({ error: "New phone number must be 10 digits." });
  }

  // Validate that any update field has a corresponding proof
  if (
    (newName && !nameProofUrl) ||
    (newAddress && !addressProofUrl) ||
    (newPhoneNumber && !phoneProofUrl)
  ) {
    return res
      .status(400)
      .json({ error: "Each update field requires a proof document." });
  }

  // Generate & send OTP
  let otp;
  try {
    otp = await sendOTP(email);
    console.log("[raiseticket] OTP sent:", otp);
  } catch (otpErr) {
    console.error("[raiseticket] sendOTP error:", otpErr);
    return res.status(500).json({ error: "Unable to send OTP." });
  }

  // Build ticketData payload
  const ticketData = {
    name,
    email,
    phoneNumber,
    pdfUrl,
    createdBy: user.id,
  };

  // Add update fields and their proof URLs if they exist
  if (newName) {
    ticketData.newName = newName;
    ticketData.nameProofUrl = nameProofUrl;
  }

  if (newAddress) {
    ticketData.newAddress = newAddress;
    ticketData.addressProofUrl = addressProofUrl;
  }

  if (newPhoneNumber) {
    ticketData.newPhoneNumber = newPhoneNumber;
    ticketData.phoneProofUrl = phoneProofUrl;
  }

  // Save a pending ticket
  try {
    const pendingTicket = new PendingTicket({
      ticketData,
      email,
      otp,
      otpSentAt: new Date(),
      otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
      maxAttempts: 3,
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

  const { pendingTicketId, otp } = req.body;
  if (!pendingTicketId || !otp) {
    console.warn("[verifyTicket] missing fields");
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Fetch pending ticket
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

  // Check if max attempts exceeded
  if (pendingTicket.attempts >= pendingTicket.maxAttempts) {
    console.warn("[verifyTicket] max attempts exceeded");
    return res.status(400).json({
      error:
        "Maximum verification attempts exceeded. Please create a new ticket.",
    });
  }

  // Increment attempts
  pendingTicket.attempts += 1;
  await pendingTicket.save();

  // Check expiration
  if (pendingTicket.otpExpiresAt < new Date()) {
    console.warn("[verifyTicket] OTP expired at", pendingTicket.otpExpiresAt);
    return res.status(400).json({ error: "OTP has expired." });
  }

  // Validate OTP (email is already trusted from DB)
  if (pendingTicket.otp !== otp) {
    console.warn("[verifyTicket] OTP mismatch", {
      expected: pendingTicket.otp,
      actual: otp,
    });
    return res.status(400).json({
      error: "OTP verification failed.",
      attemptsRemaining: pendingTicket.maxAttempts - pendingTicket.attempts,
    });
  }

  // Persist final ticket
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

// For updating existing tickets
exports.updateTicket = async (req, res) => {
  console.log("[updateTicket] body:", req.body);

  // Authenticate user
  let user;
  try {
    user = getUserFromToken(req);
  } catch (authErr) {
    console.error("[updateTicket] auth error:", authErr);
    return res.status(authErr.status || 401).json({ error: authErr.message });
  }

  const { ticketId } = req.params;
  const updates = req.body;

  // Validate that at least one update is provided
  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No updates provided." });
  }

  const {
    newName,
    nameProofUrl,
    newAddress,
    addressProofUrl,
    newPhoneNumber,
    phoneProofUrl,
  } = updates;

  // Validate proof documents
  if (
    (newName && !nameProofUrl) ||
    (newAddress && !addressProofUrl) ||
    (newPhoneNumber && !phoneProofUrl)
  ) {
    return res
      .status(400)
      .json({ error: "Each update field requires a proof document." });
  }

  // Validate newPhoneNumber if provided
  if (newPhoneNumber && !/^\d{10}$/.test(newPhoneNumber)) {
    return res
      .status(400)
      .json({ error: "New phone number must be 10 digits." });
  }

  // Find the ticket
  let ticket;
  try {
    ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found." });
    }

    // Verify the user owns the ticket
    if (ticket.createdBy.toString() !== user.id) {
      return res
        .status(403)
        .json({ error: "You don't have permission to update this ticket." });
    }

    // Apply updates
    if (newName) {
      ticket.newName = newName;
      ticket.nameProofUrl = nameProofUrl;
    }

    if (newAddress) {
      ticket.newAddress = newAddress;
      ticket.addressProofUrl = addressProofUrl;
    }

    if (newPhoneNumber) {
      ticket.newPhoneNumber = newPhoneNumber;
      ticket.phoneProofUrl = phoneProofUrl;
    }

    // Reset status to pending for review
    ticket.status = "pending";

    await ticket.save();

    return res.status(200).json({
      message: "Ticket updated successfully.",
      ticket,
    });
  } catch (error) {
    console.error("[updateTicket] error:", error);
    return res.status(500).json({ error: "Failed to update ticket." });
  }
};
