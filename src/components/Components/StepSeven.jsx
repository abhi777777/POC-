import React from "react";
import { Grid, Typography, TextField, Box } from "@mui/material";
import { useFormikContext } from "formik";

const StepSeven = ({ errors, touched }) => {
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
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" gutterBottom>
        Additional Information
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Please provide the following identification details.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="PAN Number"
            name="additional.pan"
            value={values.additional.pan}
            onChange={handlePanChange}
            error={touched.additional?.pan && Boolean(errors.additional?.pan)}
            helperText={touched.additional?.pan && errors.additional?.pan}
            fullWidth
            inputProps={{ maxLength: 10 }}
            placeholder="ABCDE1234F"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Aadhaar Number"
            name="additional.aadhar"
            value={values.additional.aadhar}
            onChange={handleAadhaarChange}
            error={
              touched.additional?.aadhar && Boolean(errors.additional?.aadhar)
            }
            helperText={touched.additional?.aadhar && errors.additional?.aadhar}
            placeholder="XXXX XXXX XXXX"
            fullWidth
            inputProps={{ maxLength: 14 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
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
              touched.additional?.gstNumber && errors.additional?.gstNumber
            }
            fullWidth
            inputProps={{ maxLength: 15 }}
            placeholder="12ABCDE1234F5G6"
          />
        </Grid>
      </Grid>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
        Please ensure all information is accurate and matches your official
        documents.
      </Typography>
    </Box>
  );
};

export default StepSeven;
