// services/mailer/index.js

const nodemailer = require("nodemailer");
const config = require("../../config");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (email) => {
  if (!email || typeof email !== "string" || !email.trim()) {
    throw new Error("Invalid email address for OTP.");
  }

  const otp = generateOTP();

  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });

  const mailOptions = {
    from: config.smtp.fromEmail,
    to: email.trim(),
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
  };

  console.log("[sendOTP] Sending OTP to:", email);

  await transporter.sendMail(mailOptions);
  return otp;
};

const sendPolicyReceiptEmail = async (toEmail, pdfBuffer) => {
  // we're using Gmail's service directly
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "abhimanchauhan7@gmail.com",
      pass: "yorn nkfe oczf dfbd",
    },
  });

  const mailOptions = {
    from: "abhimanchauhan7@gmail.com",

    to: toEmail,
    subject: "Your Policy Purchase Receipt",
    text: "Please find attached your policy receipt.",
    attachments: [
      {
        filename: "policy-receipt.pdf",
        content: pdfBuffer,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  generateOTP,
  sendOTP,
  sendPolicyReceiptEmail,
};
