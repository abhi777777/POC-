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

  // Calculate discount
  const getDiscount = () => {
    if (formData.tenure === 2) return 5;
    if (formData.tenure === 3) return 10;
    return 0;
  };

  const discount = getDiscount();

  return (
    <Box sx={{ p: isSmallScreen ? 1 : 2 }}>
      <Typography
        variant={isSmallScreen ? "subtitle2" : "h6"}
        align="center"
        gutterBottom
        sx={{ mb: isSmallScreen ? 1 : 2 }}
      >
        DECIDE YOUR COVERAGE AND TENURE
      </Typography>

      {/* Static discount note always visible */}
      <Typography
        variant="caption"
        align="center"
        display="block"
        sx={{ mb: isSmallScreen ? 2 : 3, color: "text.secondary" }}
      >
        Enjoy up to 10% off: 5% on 2‑year plans and 10% on 3‑year plans.
      </Typography>

      <Grid container spacing={isSmallScreen ? 2 : 3} direction="column">
        <Grid item xs={12}>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              fontWeight: 500,
              fontSize: isSmallScreen ? "0.9rem" : "1rem",
            }}
          >
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
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              fontWeight: 500,
              fontSize: isSmallScreen ? "0.9rem" : "1rem",
            }}
          >
            Policy Tenure
          </Typography>
          <FormControl fullWidth variant="outlined">
            <Select
              value={formData.tenure || ""}
              onChange={handleChange("tenure")}
              displayEmpty
              sx={{ fontSize: isSmallScreen ? "0.9rem" : "1rem" }}
            >
              <MenuItem value={1}>1 Year</MenuItem>
              <MenuItem value={2}>
                2 Years{" "}
                {discount === 5 && (
                  <Typography
                    component="span"
                    sx={{ color: "green", fontWeight: 500 }}
                  >
                    - {discount}% off
                  </Typography>
                )}
              </MenuItem>
              <MenuItem value={3}>
                3 Years{" "}
                {discount === 10 && (
                  <Typography
                    component="span"
                    sx={{ color: "green", fontWeight: 500 }}
                  >
                    - {discount}% off
                  </Typography>
                )}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {discount > 0 && (
          <>
            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                align="center"
                sx={{ color: "green", fontWeight: 500 }}
              >
                Congratulations! You get a {discount}% discount on your premium.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="caption"
                align="center"
                sx={{ color: "text.secondary" }}
              >
                Note: Discounts are applied automatically at checkout and cannot
                be combined with other promotions.
              </Typography>
            </Grid>
          </>
        )}

        <Grid item xs={12} sx={{ mt: isSmallScreen ? 1 : 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: isSmallScreen ? "column" : "row",
              justifyContent: "space-between",
            }}
          >
            {onBack && (
              <Button
                variant="outlined"
                onClick={onBack}
                sx={{ mr: isSmallScreen ? 0 : 1, mb: isSmallScreen ? 1 : 0 }}
                fullWidth={isSmallScreen}
              >
                Back
              </Button>
            )}
            {onNext && (
              <Button
                variant="contained"
                onClick={onNext}
                disabled={!stepValid}
                sx={{ ml: isSmallScreen ? 0 : "auto" }}
                fullWidth={isSmallScreen}
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
