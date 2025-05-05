const mongoose = require("mongoose");

// Core ticket fields used in final Ticket model
const TicketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
  },
  pdfUrl: { type: String, required: true },
  // Optional update fields with their proof URLs
  newName: { type: String },
  nameProofUrl: { type: String },
  newAddress: { type: String },
  addressProofUrl: { type: String },
  newPhoneNumber: { type: String },
  phoneProofUrl: { type: String },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

// PendingTicket only needs the same ticketData plus OTP lifecycle
const PendingTicketSchema = new mongoose.Schema({
  ticketData: {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },
    pdfUrl: { type: String, required: true },
    // Optional updates and proofs
    newName: { type: String },
    nameProofUrl: { type: String },
    newAddress: { type: String },
    addressProofUrl: { type: String },
    newPhoneNumber: { type: String },
    phoneProofUrl: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  email: { type: String, required: true },
  otp: { type: String, required: true },
  otpSentAt: { type: Date, default: Date.now },
  otpExpiresAt: { type: Date, required: true },
});

const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);
const PendingTicket =
  mongoose.models.PendingTicket ||
  mongoose.model("PendingTicket", PendingTicketSchema);

module.exports = { Ticket, PendingTicket };
