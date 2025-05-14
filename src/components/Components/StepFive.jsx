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
  Card,
  CardContent,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  MedicalServices,
  InfoOutlined,
} from "@mui/icons-material";

const StepFive = ({ errors, touched }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { values, setFieldValue } = useFormikContext();

  const handleAddEntry = () => {
    setFieldValue("medicalHistory", [...values.medicalHistory, ""]);
  };

  const handleRemoveEntry = (index) => {
    const updatedHistory = [...values.medicalHistory];
    updatedHistory.splice(index, 1);
    setFieldValue("medicalHistory", updatedHistory);
  };

  const handleEntryChange = (index, value) => {
    const updatedHistory = [...values.medicalHistory];
    updatedHistory[index] = value;
    setFieldValue("medicalHistory", updatedHistory);
  };

  const hasError = (index) => {
    return (
      touched.medicalHistory &&
      touched.medicalHistory[index] &&
      errors.medicalHistory &&
      errors.medicalHistory[index]
    );
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
        Medical History
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 2, fontStyle: "italic" }}
        >
          Please provide information about any medical conditions, past
          surgeries, or ongoing treatments. This information is important for
          determining your insurance coverage accurately.
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
            <MedicalServices color="action" />
            <Typography
              sx={{ ml: 1, fontWeight: "medium", fontSize: "1.05rem" }}
            >
              Medical Conditions
            </Typography>
            <Tooltip title="List any diagnosed conditions, surgeries, or treatments you're currently receiving">
              <InfoOutlined
                fontSize="small"
                sx={{ ml: 1, opacity: 0.7, fontSize: 16 }}
              />
            </Tooltip>
          </Box>

          {values.medicalHistory.map((entry, index) => (
            <Grid
              container
              spacing={2}
              alignItems="center"
              key={index}
              sx={{
                mb: 2,
                p: 1,
                borderRadius: 1,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.01)",
                border: `1px solid ${
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)"
                }`,
              }}
            >
              <Grid item xs={isSmallScreen ? 9 : 10}>
                <TextField
                  fullWidth
                  label={`Medical condition ${index + 1}`}
                  placeholder="e.g., Diabetes, Hypertension, etc."
                  value={entry}
                  onChange={(e) => handleEntryChange(index, e.target.value)}
                  error={hasError(index)}
                  helperText={
                    hasError(index) ? errors.medicalHistory[index] : ""
                  }
                  size="small"
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                xs={isSmallScreen ? 3 : 2}
                sx={{ textAlign: "center" }}
              >
                <Tooltip
                  title={
                    values.medicalHistory.length <= 1
                      ? "At least one condition required"
                      : "Remove condition"
                  }
                >
                  <span>
                    <IconButton
                      onClick={() => handleRemoveEntry(index)}
                      color="error"
                      disabled={values.medicalHistory.length <= 1}
                      size="small"
                      sx={{
                        bgcolor:
                          values.medicalHistory.length > 1
                            ? "error.light"
                            : "transparent",
                        opacity: values.medicalHistory.length > 1 ? 0.9 : 0.5,
                        "&:hover": {
                          bgcolor:
                            values.medicalHistory.length > 1
                              ? "error.main"
                              : "transparent",
                        },
                      }}
                    >
                      <DeleteIcon
                        fontSize="small"
                        sx={{
                          color:
                            values.medicalHistory.length > 1
                              ? "white"
                              : "inherit",
                        }}
                      />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          ))}

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddEntry}
              variant="contained"
              color="primary"
              size="small"
              sx={{
                borderRadius: 4,
                px: 3,
                py: 1,
                boxShadow: 2,
                textTransform: "none",
                fontWeight: "medium",
              }}
            >
              Add Another Condition
            </Button>
          </Box>

          {/* Display array-level error message if any */}
          {touched.medicalHistory &&
            typeof errors.medicalHistory === "string" && (
              <Typography
                color="error"
                variant="caption"
                sx={{ display: "block", mt: 2, textAlign: "center" }}
              >
                {errors.medicalHistory}
              </Typography>
            )}
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
          <strong>Why we need this:</strong> This information helps us determine
          appropriate coverage and premium rates. Rest assured that all medical
          information is kept strictly confidential and is used only for
          insurance evaluation purposes.
        </Typography>
      </Box>

      <Box sx={{ mt: 3, textAlign: "right" }}>
        <Typography variant="caption" color="textSecondary">
          If you have no pre-existing conditions, please write "None" in the
          field
        </Typography>
      </Box>
    </Paper>
  );
};

export default StepFive;
