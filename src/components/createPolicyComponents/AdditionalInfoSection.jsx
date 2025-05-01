// src/components/CreatePolicyForm/AdditionalInfoSection.jsx
import React from "react";
import { Grid, Typography, TextField } from "@mui/material";

const AdditionalInfoSection = ({ formData, setFormData }) => {
  const handleAdditionalChange = (field) => (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      additional: { ...prev.additional, [field]: value },
    }));
  };

  return (
    <>
      <Typography variant="subtitle1">Additional Information</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Pan Number"
            name="pan"
            value={formData.additional.pan}
            onChange={handleAdditionalChange("pan")}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Aadhar Number"
            name="aadhar"
            value={formData.additional.aadhar}
            onChange={handleAdditionalChange("aadhar")}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="GST Number"
            name="gstNumber"
            value={formData.additional.gstNumber}
            onChange={handleAdditionalChange("gstNumber")}
            fullWidth
          />
        </Grid>
      </Grid>
    </>
  );
};

export default AdditionalInfoSection;
