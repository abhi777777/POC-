// src/components/CreatePolicyForm/BMISection.jsx
import React, { useEffect } from "react";
import { Grid, Typography, TextField } from "@mui/material";
import { heightToMeters, cmToFeetInches, calculateBMI } from "./formState";

const BMISection = ({ formData, setFormData }) => {
  // Handle height conversion between cm and feet/inches
  useEffect(() => {
    if (formData.heightCm) {
      const { feet, inches } = cmToFeetInches(Number(formData.heightCm));
      setFormData((prev) => ({
        ...prev,
        heightFt: feet,
        heightInches: inches,
      }));
    }
  }, [formData.heightCm, setFormData]);

  // Calculate BMI whenever height or weight changes
  useEffect(() => {
    const { heightFt, heightInches, weight } = formData;
    if (heightFt && heightInches && weight) {
      const heightM = heightToMeters(Number(heightFt), Number(heightInches));
      const bmiVal = calculateBMI(heightM, weight);
      setFormData((prev) => ({ ...prev, bmi: bmiVal }));
    }
  }, [formData.heightFt, formData.heightInches, formData.weight, setFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Typography variant="subtitle1">BMI Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Height (cm)"
            name="heightCm"
            type="number"
            value={formData.heightCm}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Height (ft)"
            name="heightFt"
            type="number"
            value={formData.heightFt}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Height (inches)"
            name="heightInches"
            type="number"
            value={formData.heightInches}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Weight (kg)"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="BMI"
            name="bmi"
            value={formData.bmi}
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Grid>
      </Grid>
    </>
  );
};

export default BMISection;
