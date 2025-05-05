// src/components/CreatePolicyForm/createPolicyComponents/BMISection.jsx
import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { heightToMeters, cmToFeetInches, calculateBMI } from "./formState";

const BMISection = ({ formData, setFormData, setStepValid }) => {
  const [unit, setUnit] = useState("cm");

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
  };

  // Sync cm → ft/in
  useEffect(() => {
    if (unit === "cm" && formData.heightCm) {
      const { feet, inches } = cmToFeetInches(Number(formData.heightCm));
      setFormData((prev) => ({
        ...prev,
        heightFt: feet,
        heightInches: inches,
      }));
    }
  }, [unit, formData.heightCm, setFormData]);

  // Sync ft/in → cm
  useEffect(() => {
    if (unit === "ft" && formData.heightFt) {
      const totalInches =
        Number(formData.heightFt) * 12 + Number(formData.heightInches);
      setFormData((prev) => ({
        ...prev,
        heightCm: Math.round(totalInches * 2.54),
      }));
    }
  }, [unit, formData.heightFt, formData.heightInches, setFormData]);

  // Auto-calc BMI
  useEffect(() => {
    const { heightFt, heightInches, heightCm, weight } = formData;
    let heightM = 0;

    if (unit === "cm" && heightCm) {
      heightM = Number(heightCm) / 100;
    } else if ((heightFt || heightInches) && unit === "ft") {
      heightM = heightToMeters(Number(heightFt), Number(heightInches));
    }

    if (heightM && weight) {
      const bmiVal = calculateBMI(heightM, Number(weight));
      setFormData((prev) => ({ ...prev, bmi: bmiVal }));
    }
  }, [
    unit,
    formData.heightCm,
    formData.heightFt,
    formData.heightInches,
    formData.weight,
    setFormData,
  ]);

  // Step validation
  useEffect(() => {
    const { heightFt, heightInches, heightCm, weight, bmi } = formData;
    const weightValid = Number(weight) > 0;
    const bmiValid = Number(bmi) > 0;

    let heightValid = false;
    if (unit === "cm") {
      heightValid = Number(heightCm) > 0;
    } else {
      heightValid = Number(heightFt) > 0 || Number(heightInches) > 0;
    }

    setStepValid(weightValid && heightValid && bmiValid);
  }, [
    formData.weight,
    formData.heightCm,
    formData.heightFt,
    formData.heightInches,
    formData.bmi,
    unit,
    setStepValid,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Typography variant="subtitle1" gutterBottom>
        BMI Details
      </Typography>

      {/* Height & Weight Inputs */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="unit-select-label">Unit</InputLabel>
            <Select
              labelId="unit-select-label"
              label="Unit"
              value={unit}
              onChange={handleUnitChange}
            >
              <MenuItem value="cm">Centimeters</MenuItem>
              <MenuItem value="ft">Feet/Inches</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {unit === "cm" ? (
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
        ) : (
          <>
            <Grid item xs={12} sm={2}>
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
            <Grid item xs={12} sm={2}>
              <TextField
                label="Height (in)"
                name="heightInches"
                type="number"
                value={formData.heightInches}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
          </>
        )}

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
      </Grid>

      {/* Always-Bottom BMI Field */}
      <Grid container>
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
