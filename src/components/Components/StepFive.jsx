import React from "react";
import { useFormikContext } from "formik";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const StepFive = ({ errors, touched }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { values, setFieldValue } = useFormikContext();

  // Add a new entry
  const handleAddEntry = () => {
    setFieldValue("medicalHistory", [...values.medicalHistory, ""]);
  };

  // Remove an entry
  const handleRemoveEntry = (index) => {
    const updatedHistory = [...values.medicalHistory];
    updatedHistory.splice(index, 1);
    setFieldValue("medicalHistory", updatedHistory);
  };

  // Update an entry
  const handleEntryChange = (index, value) => {
    const updatedHistory = [...values.medicalHistory];
    updatedHistory[index] = value;
    setFieldValue("medicalHistory", updatedHistory);
  };

  // Check if there's an error for the specific index
  const hasError = (index) => {
    return (
      touched.medicalHistory &&
      touched.medicalHistory[index] &&
      errors.medicalHistory &&
      errors.medicalHistory[index]
    );
  };

  return (
    <Box sx={{ p: isSmallScreen ? 1 : 2 }}>
      <Typography
        variant={isSmallScreen ? "subtitle1" : "h6"}
        gutterBottom
        sx={{ mb: 3 }}
      >
        Medical History
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please provide information about any medical conditions, past surgeries,
        or ongoing treatments.
      </Typography>

      <Paper elevation={0} sx={{ p: 2, bgcolor: "background.paper" }}>
        {values.medicalHistory.map((entry, index) => (
          <Grid
            container
            spacing={1}
            alignItems="center"
            key={index}
            sx={{ mb: 2 }}
          >
            <Grid item xs={isSmallScreen ? 9 : 10}>
              <TextField
                fullWidth
                label={`Medical condition ${index + 1}`}
                value={entry}
                onChange={(e) => handleEntryChange(index, e.target.value)}
                error={hasError(index)}
                helperText={hasError(index) ? errors.medicalHistory[index] : ""}
                size={isSmallScreen ? "small" : "medium"}
              />
            </Grid>
            <Grid item xs={isSmallScreen ? 3 : 2}>
              <IconButton
                onClick={() => handleRemoveEntry(index)}
                color="error"
                disabled={values.medicalHistory.length <= 1}
                sx={{ ml: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button
          startIcon={<AddIcon />}
          onClick={handleAddEntry}
          variant="outlined"
          sx={{ mt: 1 }}
          size={isSmallScreen ? "small" : "medium"}
        >
          Add Medical Condition
        </Button>

        {/* Display array-level error message if any */}
        {touched.medicalHistory &&
          typeof errors.medicalHistory === "string" && (
            <Typography
              color="error"
              variant="caption"
              sx={{ display: "block", mt: 1 }}
            >
              {errors.medicalHistory}
            </Typography>
          )}
      </Paper>

      <Typography
        variant="caption"
        sx={{ display: "block", mt: 3, color: "text.secondary" }}
      >
        Note: This information is important for determining your insurance
        coverage. Please be as accurate and complete as possible.
      </Typography>
    </Box>
  );
};

export default StepFive;
