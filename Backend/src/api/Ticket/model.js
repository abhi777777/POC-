// models/Ticket.js
const mongoose = require("mongoose");

//
// Permanent Ticket Schema
//
const TicketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
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
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  pdfUrl: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  newName: {
    type: String,
  },
  newAddress: {
    type: String,
  },
  newPhoneNumber: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//
// Pending Ticket Schema
//
const PendingTicketSchema = new mongoose.Schema({
  ticketData: {
    name: {
      type: String,
      required: true,
    },
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
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    newName: {
      type: String,
    },
    newAddress: {
      type: String,
    },
    newPhoneNumber: {
      type: String,
    },
  },
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpSentAt: {
    type: Date,
    default: Date.now,
  },
  otpExpiresAt: {
    type: Date,
    required: true,
  },
});

// Export both models from the same file
const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);
const PendingTicket =
  mongoose.models.PendingTicket ||
  mongoose.model("PendingTicket", PendingTicketSchema);

module.exports = { Ticket, PendingTicket };
