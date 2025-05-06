const mongoose = require("mongoose");

const nomineeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    relation: { type: String, required: true },
    gender: { type: String, required: true },
    contribution: { type: Number, required: true },
  },
  { _id: false }
);

const policySchema = new mongoose.Schema(
  {
    // Basic Details

    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    occupation: { type: String, required: true },
    dob: { type: Date, required: true },
    income: { type: Number, required: true },
    gender: { type: String, required: true },

    // Summing
    coverageAmount: { type: Number, required: true },
    tenure: { type: Number, required: true },
    premium: { type: Number, required: true },

    // BMI Section
    heightCm: { type: Number, required: true },
    heightFt: { type: Number, required: true },
    heightInches: { type: Number, required: true },
    weight: { type: Number, required: true },
    bmi: { type: Number, required: true },

    // Lifestyle Section
    lifestyle: {
      smoking: {
        freq: { type: String, default: 0 },
        quantity: { type: Number, default: 0 },
      },
      drinking: {
        freq: { type: String, default: 0 },
        quantity: { type: Number, default: 0 },
      },
      panMasala: {
        freq: { type: String, default: 0 },
        quantity: { type: Number, default: 0 },
      },
      others: { type: String, default: "" },
    },
    medicalHistory: { type: [String], default: ["null"] },

    // Nominees
    nominees: {
      type: [nomineeSchema],
      validate: {
        validator: function (v) {
          if (v.length === 0) return false;
          const totalContribution = v.reduce(
            (sum, nominee) => sum + nominee.contribution,
            0
          );
          return totalContribution === 100;
        },
        message: "Total contribution of nominees must equal 100.",
      },
      required: true,
    },

    additional: {
      pan: { type: String, required: true },
      aadhar: { type: String, required: true },
      gstNumber: { type: String, required: true },
    },

    // Reference to the producer who created this policy
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    purchased: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Policy = mongoose.model("Policy", policySchema);

const purchaseSchema = new mongoose.Schema(
  {
    consumer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    policy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Policy",
      required: true,
    },
    purchaseDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = { Policy, Purchase };
