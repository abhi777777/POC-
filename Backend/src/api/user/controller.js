const { User, Login } = require("./model");
const { generateToken, verifyToken } = require("../../services/jwt/index");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, mobile, dob, role, password, address } = req.body;

    const user = new User({
      name,
      email,
      mobile,
      dob,
      role,
      password,
      address,
    });

    await user.save();
    console.log("New user registered");
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// login of the user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Finding the user in the database");

    const user = await User.findOne({ email });
    if (!user) {
      console.log("user does not exist, go register first");
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Invalid password");
      return res.status(400).json({ error: "Invalid email or password." });
    }

    console.log("user found! Welcome");
    console.log("generating token");
    const token = generateToken(user);

    const loginRecord = new Login({
      userId: user._id,
      role: user.role,
    });
    await loginRecord.save();
    console.log("record is saved in MongoDB");

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ role: user.role });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.verify = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader && authHeader.split(" ")[1];
    const token = tokenFromHeader || req.cookies.token;

    if (!token) {
      console.error("No token provided on verify request");
      return res.status(401).json({ error: "Token missing." });
    }

    console.log("VERIFY: raw token:", token);

    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.payload) {
      console.error("VERIFY: jwt.decode failed or returned no payload");
      return res.status(401).json({ error: "Invalid token format." });
    }
    console.log("VERIFY: decoded payload:", decoded.payload);

    const { role } = decoded.payload;
    if (!role) {
      console.error("VERIFY: decoded token has no role field");
      return res.status(401).json({ error: "Invalid token format." });
    }

    let payload;
    try {
      payload = verifyToken(token, role);
      console.log("VERIFY: jwt.verify succeeded:", payload);
    } catch (verifyErr) {
      console.error("VERIFY: jwt.verify error:", verifyErr.message);

      return res.status(401).json({ error: verifyErr.message });
    }

    return res.json({ ok: true, role: payload.role });
  } catch (err) {
    console.error("VERIFY: unexpected error:", err);
    return res
      .status(500)
      .json({ error: "Server error during authorization." });
  }
};
