import React from "react";
import { useFormikContext, FieldArray } from "formik";
import {
  Grid,
  TextField,
  IconButton,
  MenuItem,
  Typography,
  Button,
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
  Delete as DeleteIcon,
  Add as AddIcon,
  Person,
  InfoOutlined,
  GroupAdd,
} from "@mui/icons-material";

const StepSix = ({ errors, touched }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { values, setFieldValue, getFieldProps } = useFormikContext();
  const relationOptions = ["Father", "Mother", "Brother", "Sister", "Other"];
  const genderOptions = ["Male", "Female", "Other"];

  // Calculate total contribution
  const totalContribution = values.nominees.reduce(
    (sum, nominee) => sum + Number(nominee.contribution || 0),
    0
  );

  // Handle relationship change with auto-gender setting
  const handleRelationChange = (index, e) => {
    const value = e.target.value;
    setFieldValue(`nominees[${index}].relation`, value);

    // Auto-set gender based on relation
    if (value === "Father" || value === "Brother") {
      setFieldValue(`nominees[${index}].gender`, "Male");
    } else if (value === "Mother" || value === "Sister") {
      setFieldValue(`nominees[${index}].gender`, "Female");
    } else {
      setFieldValue(`nominees[${index}].gender`, "");
    }
  };

  // Handle name change with validation
  const handleNameChange = (index, e) => {
    const val = e.target.value;
    if (/^[A-Za-z ]*$/.test(val)) {
      setFieldValue(`nominees[${index}].name`, val);
    }
  };

  const getContributionColor = () => {
    if (totalContribution > 100) return theme.palette.error.main;
    if (totalContribution === 100) return theme.palette.success.main;
    return theme.palette.text.secondary;
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
        Nominee Details
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 2, fontStyle: "italic" }}
        >
          Please add nominee details and their contribution percentage. Total
          contribution must equal 100%. You can add up to 5 nominees.
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
            <GroupAdd color="action" />
            <Typography
              sx={{ ml: 1, fontWeight: "medium", fontSize: "1.05rem" }}
            >
              Nominees
            </Typography>
            <Tooltip title="Add the people who will receive benefits from your insurance policy">
              <InfoOutlined
                fontSize="small"
                sx={{ ml: 1, opacity: 0.7, fontSize: 16 }}
              />
            </Tooltip>
          </Box>

          <FieldArray name="nominees">
            {({ push, remove }) => (
              <>
                {values.nominees.map((nominee, index) => (
                  <Box
                    key={index}
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
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Person fontSize="small" color="primary" />
                      <Typography
                        variant="subtitle1"
                        sx={{ ml: 1, fontWeight: 500 }}
                      >
                        Nominee {index + 1}
                      </Typography>

                      {values.nominees.length > 1 && (
                        <Tooltip title="Remove nominee">
                          <IconButton
                            onClick={() => remove(index)}
                            color="error"
                            size="small"
                            sx={{
                              ml: "auto",
                              bgcolor: "error.light",
                              opacity: 0.9,
                              "&:hover": {
                                bgcolor: "error.main",
                              },
                            }}
                          >
                            <DeleteIcon
                              fontSize="small"
                              sx={{ color: "white" }}
                            />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2} direction="column">
                      {/* Name - Full width on its own line */}
                      <Grid item xs={12}>
                        <TextField
                          label="Name *"
                          {...getFieldProps(`nominees[${index}].name`)}
                          onChange={(e) => handleNameChange(index, e)}
                          fullWidth
                          required
                          size="small"
                          error={
                            touched.nominees?.[index]?.name &&
                            Boolean(errors.nominees?.[index]?.name)
                          }
                          helperText={
                            touched.nominees?.[index]?.name &&
                            errors.nominees?.[index]?.name
                          }
                          inputProps={{
                            pattern: "^[A-Za-z ]+$",
                            title: "Only alphabets and spaces allowed",
                          }}
                        />
                      </Grid>

                      {/* Relationship - Full width on its own line */}
                      <Grid item xs={12}>
                        <TextField
                          select
                          label="Relationship *"
                          {...getFieldProps(`nominees[${index}].relation`)}
                          onChange={(e) => handleRelationChange(index, e)}
                          fullWidth
                          required
                          size="small"
                          error={
                            touched.nominees?.[index]?.relation &&
                            Boolean(errors.nominees?.[index]?.relation)
                          }
                          helperText={
                            touched.nominees?.[index]?.relation &&
                            errors.nominees?.[index]?.relation
                          }
                        >
                          {relationOptions.map((relation) => (
                            <MenuItem key={relation} value={relation}>
                              {relation}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      {/* Gender - Full width on its own line */}
                      <Grid item xs={12}>
                        <TextField
                          select
                          label="Gender *"
                          {...getFieldProps(`nominees[${index}].gender`)}
                          fullWidth
                          required
                          size="small"
                          disabled={
                            nominee.relation === "Father" ||
                            nominee.relation === "Mother" ||
                            nominee.relation === "Brother" ||
                            nominee.relation === "Sister"
                          }
                          error={
                            touched.nominees?.[index]?.gender &&
                            Boolean(errors.nominees?.[index]?.gender)
                          }
                          helperText={
                            touched.nominees?.[index]?.gender &&
                            errors.nominees?.[index]?.gender
                          }
                        >
                          {genderOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      {/* Contribution - Full width on its own line */}
                      <Grid item xs={12}>
                        <TextField
                          label="Contribution Percentage *"
                          type="number"
                          {...getFieldProps(`nominees[${index}].contribution`)}
                          fullWidth
                          required
                          size="small"
                          error={
                            touched.nominees?.[index]?.contribution &&
                            Boolean(errors.nominees?.[index]?.contribution)
                          }
                          helperText={
                            touched.nominees?.[index]?.contribution &&
                            errors.nominees?.[index]?.contribution
                          }
                          InputProps={{
                            endAdornment: (
                              <Typography variant="body2">%</Typography>
                            ),
                          }}
                          inputProps={{
                            min: 0,
                            max: 100,
                            step: 1,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ))}

                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    flexDirection: isSmallScreen ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isSmallScreen ? "stretch" : "center",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() =>
                      push({
                        name: "",
                        relation: "",
                        gender: "",
                        contribution: "",
                      })
                    }
                    disabled={values.nominees.length >= 5}
                    sx={{
                      borderRadius: 4,
                      px: 3,
                      py: 1,
                      boxShadow: 2,
                      textTransform: "none",
                      fontWeight: "medium",
                    }}
                  >
                    Add Nominee
                  </Button>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(0,0,0,0.2)"
                          : "rgba(0,0,0,0.05)",
                      p: 1.5,
                      borderRadius: 2,
                      border: `1px solid ${
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.05)"
                      }`,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "medium",
                        color: getContributionColor(),
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      Total Contribution:
                      <Box
                        component="span"
                        sx={{
                          ml: 1,
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                        }}
                      >
                        {totalContribution}%
                      </Box>
                    </Typography>
                  </Box>
                </Box>

                {/* Total contribution error message */}
                {errors.nominees && typeof errors.nominees === "string" && (
                  <Typography
                    color="error"
                    variant="body2"
                    sx={{
                      mt: 2,
                      p: 1,
                      bgcolor: "error.light",
                      color: "error.contrastText",
                      borderRadius: 1,
                      opacity: 0.9,
                      textAlign: "center",
                    }}
                  >
                    {errors.nominees}
                  </Typography>
                )}

                {totalContribution > 100 && (
                  <Typography
                    color="error"
                    variant="body2"
                    sx={{
                      mt: 2,
                      p: 1,
                      bgcolor: "error.light",
                      color: "error.contrastText",
                      borderRadius: 1,
                      opacity: 0.9,
                      textAlign: "center",
                    }}
                  >
                    Total contribution exceeds 100%
                  </Typography>
                )}
              </>
            )}
          </FieldArray>
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
          <strong>Why we need this:</strong> Nominees are the individuals who
          will receive the benefits from your insurance policy. Distribution
          percentages must total exactly 100% to ensure clear allocation of
          benefits.
        </Typography>
      </Box>

      <Box sx={{ mt: 3, textAlign: "right" }}>
        <Typography variant="caption" color="textSecondary">
          You can add up to 5 nominees for your insurance policy
        </Typography>
      </Box>
    </Paper>
  );
};

export default StepSix;
