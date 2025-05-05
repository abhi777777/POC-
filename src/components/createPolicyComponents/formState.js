// src/components/CreatePolicyForm/formState.js

// Initial state for the form
export const initialState = {
  title: "",
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  mobile: "",
  address: "",
  occupation: "",
  dob: "",
  income: "",
  gender: "",
  heightCm: "",
  heightFt: "",
  heightInches: "",
  weight: "",
  bmi: "",
  coverageAmount: "",
  tenure: "",
  premium: "",
  lifestyle: {
    smoking: { freq: "", quantity: "" },
    drinking: { freq: "", quantity: "" },
    panMasala: { freq: "", quantity: "" },
    others: "",
  },
  medicalHistory: [""],
  nominees: [{ name: "", relation: "", gender: "", contribution: "" }],
  additional: { pan: "", aadhar: "", gstNumber: "" },
};

// Utility functions
export const heightToMeters = (ft, inches) => {
  const totalInches = ft * 12 + inches;
  return totalInches * 0.0254; // Convert to meters
};

export const cmToFeetInches = (cm) => {
  if (!cm) return { feet: 0, inches: 0 };

  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);

  return { feet, inches };
};

export const calculateBMI = (heightM, weight) => {
  if (!heightM || !weight) return "";
  return (weight / (heightM * heightM)).toFixed(2);
};
