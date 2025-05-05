import React from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";

export default function Summing({
  formData,
  setFormData,
  stepValid,
  setStepValid,
  onNext,
  onBack,
}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (field) => (e) => {
    const raw = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: raw,
    }));
  };

  const validateFields = () => {
    const isCovValid =
      formData.coverageAmount >= 300000 && formData.coverageAmount <= 5000000;
    const isTenValid = [1, 2, 3].includes(formData.tenure);
    setStepValid(isCovValid && isTenValid);
  };

  React.useEffect(validateFields, [formData.coverageAmount, formData.tenure]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant={isSmallScreen ? "subtitle1" : "h6"}
        align="center"
        gutterBottom
        sx={{ mb: 3 }}
      >
        Policy Summary
      </Typography>

      <Grid container spacing={3} direction="column">
        <Grid item xs={12}>
          <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
            Coverage Amount (₹)
          </Typography>
          <TextField
            type="number"
            fullWidth
            value={formData.coverageAmount || ""}
            onChange={handleChange("coverageAmount")}
            inputProps={{ min: 300000, max: 5000000, step: 10000 }}
            helperText="Enter between ₹3L and ₹50L"
            placeholder="300000"
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
            Policy Tenure
          </Typography>
          <FormControl fullWidth variant="outlined">
            <Select
              value={formData.tenure || "Tenure"}
              onChange={handleChange("tenure")}
              displayEmpty
            >
              <MenuItem value={1}>1 Year</MenuItem>
              <MenuItem value={2}>2 Years</MenuItem>
              <MenuItem value={3}>3 Years</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sx={{ mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {onBack && (
              <Button variant="outlined" onClick={onBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            {onNext && (
              <Button
                variant="contained"
                onClick={onNext}
                disabled={!stepValid}
                sx={{ ml: "auto" }}
              >
                Next
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
