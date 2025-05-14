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
  Paper,
  Box,
  Card,
  CardContent,
  Tooltip,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import {
  InfoOutlined,
  Height,
  Scale,
  CalculateOutlined,
} from "@mui/icons-material";

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

const getBMICategory = (bmi) => {
  if (!bmi) return { category: "", color: "" };

  const numBmi = parseFloat(bmi);

  if (numBmi < 18.5)
    return {
      category: "Underweight",
      color: "#2196F3", // blue
    };
  if (numBmi < 25)
    return {
      category: "Normal",
      color: "#4CAF50", // green
    };
  if (numBmi < 30)
    return {
      category: "Overweight",
      color: "#FF9800", // orange
    };
  return {
    category: "Obese",
    color: "#F44336", // red
  };
};

const StepTwo = ({ errors, touched }) => {
  const [unit, setUnit] = useState("cm");
  const { values, setFieldValue, handleChange, handleBlur } =
    useFormikContext();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

  const bmiInfo = getBMICategory(values.bmi);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(145deg, #2d2d2d 0%, #1f1f1f 100%)"
            : "linear-gradient(145deg, #f9f9f9 0%, #ffffff 100%)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: "bold",
          color: theme.palette.primary.main,
          display: "flex",
          alignItems: "center",
          "&:after": {
            content: '""',
            display: "block",
            height: "2px",
            background: theme.palette.primary.main,
            flex: 1,
            ml: 2,
            borderRadius: 1,
            opacity: 0.7,
          },
        }}
      >
        BMI Details
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 2, fontStyle: "italic" }}
        >
          Please provide your height and weight information to calculate your
          Body Mass Index (BMI). Your BMI is an important health indicator that
          helps assess your overall health status.
        </Typography>
      </Box>

      <Card
        variant="outlined"
        sx={{
          mb: 3,
          borderRadius: 2,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Height color="action" />
            <Typography
              sx={{ ml: 1, fontWeight: "medium", fontSize: "1.05rem" }}
            >
              Height Information
            </Typography>
          </Box>

          <Grid container spacing={3} alignItems="center">
            {/* Unit Selector */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel
                  id="unit-label"
                  sx={{ bgcolor: "background.paper", px: 0.5 }}
                >
                  Height Unit
                </InputLabel>
                <Select
                  labelId="unit-label"
                  value={unit}
                  label="Height Unit"
                  onChange={handleUnitChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <Tooltip title="Select your preferred unit of measurement">
                        <InfoOutlined
                          fontSize="small"
                          sx={{ opacity: 0.7, fontSize: 16 }}
                        />
                      </Tooltip>
                    </InputAdornment>
                  }
                >
                  <MenuItem value="cm">Centimeters (cm)</MenuItem>
                  <MenuItem value="ft">Feet / Inches (ft/in)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Height Inputs */}
            {unit === "cm" ? (
              <Grid item xs={12} sm={8}>
                <TextField
                  name="heightCm"
                  label="Height"
                  type="number"
                  value={values.heightCm || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.heightCm && Boolean(errors.heightCm)}
                  helperText={touched.heightCm && errors.heightCm}
                  fullWidth
                  required
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="caption" color="textSecondary">
                          cm
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            ) : (
              <>
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="heightFt"
                    label="Feet"
                    type="number"
                    value={values.heightFt || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.heightFt && Boolean(errors.heightFt)}
                    helperText={touched.heightFt && errors.heightFt}
                    fullWidth
                    required
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="caption" color="textSecondary">
                            ft
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="heightInches"
                    label="Inches"
                    type="number"
                    value={values.heightInches || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.heightInches && Boolean(errors.heightInches)}
                    helperText={touched.heightInches && errors.heightInches}
                    fullWidth
                    required
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="caption" color="textSecondary">
                            in
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        sx={{
          mb: 3,
          borderRadius: 2,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Scale color="action" />
            <Typography
              sx={{ ml: 1, fontWeight: "medium", fontSize: "1.05rem" }}
            >
              Weight Information
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="weight"
                label="Weight"
                type="number"
                value={values.weight || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.weight && Boolean(errors.weight)}
                helperText={touched.weight && errors.weight}
                fullWidth
                required
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography variant="caption" color="textSecondary">
                        kg
                      </Typography>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        sx={{
          borderRadius: 2,
          transition: "all 0.3s ease",
          borderColor: values.bmi
            ? theme.palette.primary.light
            : theme.palette.divider,
          bgcolor: values.bmi
            ? theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.03)"
              : "rgba(0,0,0,0.02)"
            : "transparent",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <CalculateOutlined color="action" />
            <Typography
              sx={{ ml: 1, fontWeight: "medium", fontSize: "1.05rem" }}
            >
              BMI Results
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="bmi"
                label="Body Mass Index (BMI)"
                value={values.bmi || ""}
                InputProps={{
                  readOnly: true,
                  endAdornment: values.bmi && (
                    <InputAdornment position="end">
                      <Typography variant="caption" color="textSecondary">
                        kg/m²
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                fullWidth
                error={touched.bmi && Boolean(errors.bmi)}
                helperText={touched.bmi && errors.bmi}
                size="small"
                sx={{
                  "& .MuiInputBase-input": {
                    fontWeight: values.bmi ? "bold" : "normal",
                    color: values.bmi ? bmiInfo.color : "inherit",
                  },
                }}
              />
            </Grid>

            {values.bmi && (
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.03)",
                    border: `1px solid ${bmiInfo.color}`,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                    BMI Category:
                    <Typography
                      component="span"
                      sx={{ ml: 1, fontWeight: "bold", color: bmiInfo.color }}
                    >
                      {bmiInfo.category}
                    </Typography>
                  </Typography>

                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ display: "block", mt: 1 }}
                  >
                    {bmiInfo.category === "Underweight" &&
                      "BMI is below the healthy range. Please consult with a healthcare provider."}
                    {bmiInfo.category === "Normal" &&
                      "Your BMI is within the healthy range."}
                    {bmiInfo.category === "Overweight" &&
                      "BMI is slightly above the healthy range. Consider consulting a healthcare provider."}
                    {bmiInfo.category === "Obese" &&
                      "BMI is above the healthy range. We recommend consulting with a healthcare provider."}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, textAlign: "right" }}>
        <Typography variant="caption" color="textSecondary">
          BMI is a screening tool but not a diagnostic of body fatness or health
        </Typography>
      </Box>
    </Paper>
  );
};

export default StepTwo;
