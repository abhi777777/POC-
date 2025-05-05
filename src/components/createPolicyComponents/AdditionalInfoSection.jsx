import React, { useState, useEffect } from "react";
import { Grid, Typography, TextField, Button } from "@mui/material";
import { toast } from "react-toastify";

// Regex patterns
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const AADHAAR_REGEX = /^\d{4}\s\d{4}\s\d{4}$/;
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export default function AdditionalInfoSection({
  formData,
  setFormData,
  setStepValid,
}) {
  const [errors, setErrors] = useState({});

  // Handle change of input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      additional: { ...prev.additional, [name]: value },
    }));
  };

  // Validate individual fields
  const validateField = (name, value) => {
    let error = "";
    if (name === "pan" && !PAN_REGEX.test(value)) {
      error = "Invalid PAN format (e.g. ABCDE1234F)";
    }
    if (name === "aadhar" && !AADHAAR_REGEX.test(value)) {
      error = "Invalid Aadhaar format (XXXX XXXX XXXX)";
    }
    if (name === "gstNumber" && !GST_REGEX.test(value)) {
      error = "Invalid GSTIN format (e.g. 22ABCDE1234Z1A)";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  // Real-time validation on user input
  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  useEffect(() => {
    const isValid =
      !errors.pan &&
      !errors.aadhar &&
      !errors.gstNumber &&
      formData.additional.pan &&
      formData.additional.aadhar &&
      formData.additional.gstNumber;

    // Update step validity based on input validity
    setStepValid(isValid);
  }, [errors, formData.additional, setStepValid]);

  return (
    <>
      <Typography variant="subtitle1">Additional Info</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="PAN Number"
            name="pan"
            value={formData.additional.pan}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.pan}
            helperText={errors.pan}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Aadhaar Number"
            name="aadhar"
            value={formData.additional.aadhar}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.aadhar}
            helperText={errors.aadhar}
            placeholder="XXXX XXXX XXXX"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="GST Number"
            name="gstNumber"
            value={formData.additional.gstNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!errors.gstNumber}
            helperText={errors.gstNumber}
            fullWidth
          />
        </Grid>
      </Grid>
    </>
  );
}
