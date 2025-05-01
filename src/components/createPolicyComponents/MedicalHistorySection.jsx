// src/components/CreatePolicyForm/MedicalHistorySection.jsx
import React from "react";
import { Typography, TextField } from "@mui/material";

const MedicalHistorySection = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Typography variant="subtitle1">Medical History</Typography>
      <TextField
        label="Medical History"
        name="medicalHistory"
        value={formData.medicalHistory}
        onChange={handleChange}
        multiline
        rows={4}
        fullWidth
      />
    </>
  );
};

export default MedicalHistorySection;
