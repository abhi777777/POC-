import React from "react";
import { useFormikContext } from "formik";
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const StepThree = ({ errors, touched }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { values, handleChange, setFieldValue } = useFormikContext();

  // Calculate discount
  const getDiscount = () => {
    if (values.tenure === 2) return 5;
    if (values.tenure === 3) return 10;
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
            name="coverageAmount"
            type="number"
            fullWidth
            value={values.coverageAmount || ""}
            onChange={handleChange}
            inputProps={{ min: 300000, max: 5000000 }}
            helperText={
              touched.coverageAmount && errors.coverageAmount
                ? errors.coverageAmount
                : "Enter between ₹3L and ₹50L"
            }
            error={touched.coverageAmount && Boolean(errors.coverageAmount)}
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
          <FormControl
            fullWidth
            variant="outlined"
            error={touched.tenure && Boolean(errors.tenure)}
          >
            <Select
              name="tenure"
              value={values.tenure || ""}
              onChange={handleChange}
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
            {touched.tenure && errors.tenure && (
              <Typography color="error" variant="caption">
                {errors.tenure}
              </Typography>
            )}
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
      </Grid>
    </Box>
  );
};

export default StepThree;
