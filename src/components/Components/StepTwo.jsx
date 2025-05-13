import React, { useState, useEffect } from "react";
import { useFormikContext } from "formik";
import {
  Grid,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";

// Helper functions
const heightToMeters = (feet, inches) => {
  const totalInches = feet * 12 + inches;
  return totalInches * 0.0254;
};

const cmToFeetInches = (cm) => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
};

const calculateBMI = (heightM, weightKg) => {
  if (!heightM || !weightKg) return "";
  return (weightKg / (heightM * heightM)).toFixed(2);
};

const StepTwo = ({ errors, touched }) => {
  const [unit, setUnit] = useState("cm");
  const { values, setFieldValue, handleChange, handleBlur } =
    useFormikContext();

  const handleUnitChange = (event) => {
    setUnit(event.target.value);
  };

  // Sync cm to ft/in
  useEffect(() => {
    if (unit === "cm" && values.heightCm) {
      const { feet, inches } = cmToFeetInches(Number(values.heightCm));
      setFieldValue("heightFt", feet);
      setFieldValue("heightInches", inches);
    }
  }, [unit, values.heightCm, setFieldValue]);

  // Sync ft/in to cm
  useEffect(() => {
    if (unit === "ft" && (values.heightFt || values.heightInches)) {
      const totalInches =
        Number(values.heightFt || 0) * 12 + Number(values.heightInches || 0);
      setFieldValue("heightCm", Math.round(totalInches * 2.54));
    }
  }, [unit, values.heightFt, values.heightInches, setFieldValue]);

  // Auto-calculate BMI
  useEffect(() => {
    const { heightFt, heightInches, heightCm, weight } = values;
    let heightM = 0;

    if (unit === "cm" && heightCm) {
      heightM = Number(heightCm) / 100;
    } else if (unit === "ft" && (heightFt || heightInches)) {
      heightM = heightToMeters(
        Number(heightFt || 0),
        Number(heightInches || 0)
      );
    }

    if (heightM && weight) {
      const bmiValue = calculateBMI(heightM, Number(weight));
      setFieldValue("bmi", bmiValue);
    }
  }, [
    unit,
    values.heightCm,
    values.heightFt,
    values.heightInches,
    values.weight,
    setFieldValue,
  ]);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        BMI Details
      </Typography>

      <Grid container spacing={2} mb={2}>
        {/* Unit Selector */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="unit-label">Height Unit</InputLabel>
            <Select
              labelId="unit-label"
              value={unit}
              label="Height Unit"
              onChange={handleUnitChange}
            >
              <MenuItem value="cm">Centimeters</MenuItem>
              <MenuItem value="ft">Feet / Inches</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Height Inputs */}
        {unit === "cm" ? (
          <Grid item xs={12} sm={4}>
            <TextField
              name="heightCm"
              label="Height (cm)"
              type="number"
              value={values.heightCm}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.heightCm && Boolean(errors.heightCm)}
              helperText={touched.heightCm && errors.heightCm}
              fullWidth
              required
            />
          </Grid>
        ) : (
          <>
            <Grid item xs={12} sm={2}>
              <TextField
                name="heightFt"
                label="Height (ft)"
                type="number"
                value={values.heightFt}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.heightFt && Boolean(errors.heightFt)}
                helperText={touched.heightFt && errors.heightFt}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                name="heightInches"
                label="Height (in)"
                type="number"
                value={values.heightInches}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.heightInches && Boolean(errors.heightInches)}
                helperText={touched.heightInches && errors.heightInches}
                fullWidth
                required
              />
            </Grid>
          </>
        )}

        {/* Weight Input */}
        <Grid item xs={12} sm={4}>
          <TextField
            name="weight"
            label="Weight (kg)"
            type="number"
            value={values.weight}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.weight && Boolean(errors.weight)}
            helperText={touched.weight && errors.weight}
            fullWidth
            required
          />
        </Grid>
      </Grid>

      {/* BMI Display */}
      <Grid container>
        <Grid item xs={12} sm={4}>
          <TextField
            name="bmi"
            label="Body Mass Index (BMI)"
            value={values.bmi}
            InputProps={{ readOnly: true }}
            fullWidth
            error={touched.bmi && Boolean(errors.bmi)}
            helperText={touched.bmi && errors.bmi}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default StepTwo;
