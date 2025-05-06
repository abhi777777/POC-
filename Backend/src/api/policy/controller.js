const { Policy, Purchase } = require("./model");
const { verifyToken } = require("../../services/jwt/index");
const { generatePDFReceipt } = require("../../services/pdfkit/index");
const { sendPolicyReceiptEmail } = require("../../services/nodemailer/index");
function getUserFromToken(req) {
  const token = req.cookies?.token;
  if (!token) {
    const err = new Error("No token found");
    err.status = 401;
    throw err;
  }
  let payload;
  try {
    payload = require("jsonwebtoken").decode(token);
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
  if (!token) {
    return res.status(401).json({ error: "No token provided." });
  }

  try {
    let payload = require("jsonwebtoken").decode(token);
    payload = verifyToken(token, payload.role);

    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: " + err.message });
  }
};

// Producer endpoints
// Create policy
exports.createPolicy = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (user.role !== "producer") {
      return res
        .status(403)
        .json({ error: "Only producers can create policies." });
    }
    const policyData = { ...req.body, createdBy: user.id };
    const policy = new Policy(policyData);
    await policy.save();
    res.status(201).json({ message: "Policy created successfully.", policy });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMyPolicies = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (user.role !== "producer") {
      return res
        .status(403)
        .json({ error: "Only producers can view their policies." });
    }
    console.log("found user");
    const policies = await Policy.find({ createdBy: user.id });
    res.json({ policies });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.buyPolicy = async (req, res) => {
  try {
    const tokenUser = getUserFromToken(req);
    if (tokenUser.role !== "consumer") {
      return res
        .status(403)
        .json({ error: "Only consumers can buy policies." });
    }

    const policy = await Policy.findById(req.body.policyId);
    if (!policy) {
      return res.status(404).json({ error: "Policy not found." });
    }
    if (policy.purchased) {
      return res.status(400).json({ error: "Policy already purchased." });
    }

    const purchase = new Purchase({
      consumer: tokenUser.id,
      policy: policy._id,
    });
    await purchase.save();

    // Mark policy purchased
    policy.purchased = true;
    await policy.save();

    // Generate & send PDF

    const pdfBuffer = await generatePDFReceipt(policy, purchase);
    await sendPolicyReceiptEmail(policy.email, pdfBuffer);

    res.status(201).json({
      message: "Policy purchased. PDF sent.",
      purchase,
    });
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
};
exports.getAvailablePolicies = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (user.role !== "consumer") {
      return res
        .status(403)
        .json({ error: "Only consumers can view available policies." });
    }

    // Filter to get the policies that are not purchased
    const filter = { email: user.email, purchased: false };

    const policies = await Policy.find(filter).select(
      "  firstName middleName lastName email mobile tenure premium coverageAmount "
    );

    res.json({ policies });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// List purchased policies for consumer
exports.getMyPurchases = async (req, res) => {
  try {
    const user = getUserFromToken(req);
    if (user.role !== "consumer") {
      return res
        .status(403)
        .json({ error: "Only consumers can view their purchases." });
    }
    const purchases = await Purchase.find({ consumer: user.id }).populate(
      "policy"
    );
    res.json({ purchases });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
