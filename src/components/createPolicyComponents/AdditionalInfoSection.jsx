import React, { useState, useEffect } from "react";
import { Grid, Typography, TextField } from "@mui/material";

// Regex patterns
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const AADHAAR_REGEX = /^\d{4}\s\d{4}\s\d{4}$/;
const GST_REGEX =
  /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[0-9A-Za-z]{1}[A-Za-z]{1}[0-9A-Za-z]{1}$/;

export default function AdditionalInfoSection({
  formData,
  setFormData,
  setStepValid,
}) {
  const [errors, setErrors] = useState({});

  // Handle change of input fields with real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    // const normalizedValue = normalize(value);
    setFormData((prev) => ({
      ...prev,
      additional: { ...prev.additional, [name]: value },
    }));

    // Run validation on change to clear or update errors
    validateField(name, value);
  };

  // Validate individual fields
  const validateField = (name, value) => {
    // const value = normalize(rawValue);
    let error = "";
    switch (name) {
      case "pan":
        if (!value) error = "PAN is required";
        else if (!PAN_REGEX.test(value))
          error = "Invalid PAN format (e.g. ABCDE1234F)";
        break;
      case "aadhar":
        if (!value) error = "Aadhaar is required";
        else if (!AADHAAR_REGEX.test(value))
          error = "Invalid Aadhaar format (XXXX XXXX XXXX)";
        break;
      case "gstNumber":
        if (!value) error = "GSTIN is required";
        else if (!GST_REGEX.test(value))
          error = "Invalid GSTIN format (e.g. 12ABCDE1234F5G6)";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Validate on blur as well
  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  useEffect(() => {
    const { pan, aadhar, gstNumber } = formData.additional;
    const isValid =
      pan &&
      aadhar &&
      gstNumber &&
      !errors.pan &&
      !errors.aadhar &&
      !errors.gstNumber;

    setStepValid(isValid);
  }, [errors, formData.additional]);

  return (
    <>
      <Typography variant="subtitle1">Other Details</Typography>
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
