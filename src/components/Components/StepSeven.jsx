import React from "react";
import { useFormikContext } from "formik";
import {
  Grid,
  TextField,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Paper,
  Card,
  CardContent,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Info as InfoIcon,
  Assignment as AssignmentIcon,
  InfoOutlined,
} from "@mui/icons-material";

const StepSeven = ({ errors, touched }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { values, setFieldValue } = useFormikContext();

  // Format Aadhaar number with spaces
  const formatAadhaar = (value) => {
    // Remove all spaces first
    const digitsOnly = value.replace(/\s/g, "");
    // Add spaces after every 4 digits
    let formatted = "";
    for (let i = 0; i < digitsOnly.length; i++) {
      if (i > 0 && i % 4 === 0 && i <= 8) {
        formatted += " ";
      }
      formatted += digitsOnly[i];
    }
    return formatted;
  };

  // Special handler for Aadhaar to format input
  const handleAadhaarChange = (e) => {
    const { value } = e.target;
    // Only allow digits and limit to 12 digits (plus spaces)
    if (/^[\d\s]*$/.test(value) && value.replace(/\s/g, "").length <= 12) {
      const formattedValue = formatAadhaar(value);
      setFieldValue("additional.aadhar", formattedValue);
    }
  };

  // Convert PAN to uppercase
  const handlePanChange = (e) => {
    const { value } = e.target;
    // Force uppercase and only allow alphanumeric
    if (/^[A-Za-z0-9]*$/.test(value)) {
      const upperValue = value.toUpperCase();
      setFieldValue("additional.pan", upperValue);
    }
  };

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
        Additional Information
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 2, fontStyle: "italic" }}
        >
          Please provide the following identification details. Ensure all
          information matches your official documents.
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
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <AssignmentIcon color="action" />
            <Typography
              sx={{ ml: 1, fontWeight: "medium", fontSize: "1.05rem" }}
            >
              Identification Details
            </Typography>
            <Tooltip title="These details help us verify your identity and are required for policy issuance">
              <InfoOutlined
                fontSize="small"
                sx={{ ml: 1, opacity: 0.7, fontSize: 16 }}
              />
            </Tooltip>
          </Box>

          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(0,0,0,0.01)",
              border: `1px solid ${
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)"
              }`,
              position: "relative",
            }}
          >
            <Grid container spacing={2} direction="column">
              {/* PAN Number */}
              <Grid item xs={12}>
                <TextField
                  label="PAN Number *"
                  name="additional.pan"
                  value={values.additional.pan}
                  onChange={handlePanChange}
                  error={
                    touched.additional?.pan && Boolean(errors.additional?.pan)
                  }
                  helperText={touched.additional?.pan && errors.additional?.pan}
                  fullWidth
                  size="small"
                  inputProps={{ maxLength: 10 }}
                  placeholder="ABCDE1234F"
                />
              </Grid>

              {/* Aadhaar Number */}
              <Grid item xs={12}>
                <TextField
                  label="Aadhaar Number *"
                  name="additional.aadhar"
                  value={values.additional.aadhar}
                  onChange={handleAadhaarChange}
                  error={
                    touched.additional?.aadhar &&
                    Boolean(errors.additional?.aadhar)
                  }
                  helperText={
                    touched.additional?.aadhar && errors.additional?.aadhar
                  }
                  placeholder="XXXX XXXX XXXX"
                  fullWidth
                  size="small"
                  inputProps={{ maxLength: 14 }}
                />
              </Grid>

              {/* GST Number */}
              <Grid item xs={12}>
                <TextField
                  label="GST Number"
                  name="additional.gstNumber"
                  value={values.additional.gstNumber}
                  onChange={(e) =>
                    setFieldValue("additional.gstNumber", e.target.value)
                  }
                  error={
                    touched.additional?.gstNumber &&
                    Boolean(errors.additional?.gstNumber)
                  }
                  helperText={
                    touched.additional?.gstNumber &&
                    errors.additional?.gstNumber
                  }
                  fullWidth
                  size="small"
                  inputProps={{ maxLength: 15 }}
                  placeholder="12ABCDE1234F5G6"
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 1,
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(200, 230, 201, 0.05)"
              : "rgba(200, 230, 201, 0.2)",
          border: `1px solid ${theme.palette.mode === "dark" ? "rgba(200, 230, 201, 0.1)" : "rgba(200, 230, 201, 0.4)"}`,
        }}
      >
        <Typography variant="body2" color="textSecondary">
          <strong>Why we need this:</strong> These identification details are
          required for policy issuance and compliance with regulatory
          requirements. All information is securely stored and protected.
        </Typography>
      </Box>

      <Box sx={{ mt: 3, textAlign: "right" }}>
        <Typography variant="caption" color="textSecondary">
          Please ensure all information matches your official documents
        </Typography>
      </Box>
    </Paper>
  );
};

export default StepSeven;
