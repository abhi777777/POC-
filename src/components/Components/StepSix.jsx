import React, { useEffect } from "react";
import { useFormikContext, FieldArray } from "formik";
import {
  Grid,
  TextField,
  IconButton,
  MenuItem,
  Typography,
  Button,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const StepSix = ({ errors, touched }) => {
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

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" gutterBottom>
        Nominee Details
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Please add nominee details and their contribution percentage. Total
        contribution must equal 100%.
      </Typography>

      <FieldArray name="nominees">
        {({ push, remove }) => (
          <>
            {values.nominees.map((nominee, index) => (
              <Grid
                container
                key={index}
                direction="column"
                sx={{
                  mb: 3,
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: 2,
                }}
                spacing={2}
              >
                {/* Name */}
                <Grid item>
                  <TextField
                    label="Name"
                    {...getFieldProps(`nominees[${index}].name`)}
                    onChange={(e) => handleNameChange(index, e)}
                    fullWidth
                    required
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

                {/* Relationship */}
                <Grid item>
                  <TextField
                    select
                    label="Relationship"
                    {...getFieldProps(`nominees[${index}].relation`)}
                    onChange={(e) => handleRelationChange(index, e)}
                    fullWidth
                    required
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

                {/* Gender */}
                <Grid item>
                  <TextField
                    select
                    label="Gender"
                    {...getFieldProps(`nominees[${index}].gender`)}
                    fullWidth
                    required
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

                {/* Contribution */}
                <Grid item>
                  <TextField
                    label="Contribution %"
                    type="number"
                    {...getFieldProps(`nominees[${index}].contribution`)}
                    fullWidth
                    required
                    error={
                      touched.nominees?.[index]?.contribution &&
                      Boolean(errors.nominees?.[index]?.contribution)
                    }
                    helperText={
                      touched.nominees?.[index]?.contribution &&
                      errors.nominees?.[index]?.contribution
                    }
                    InputProps={{
                      endAdornment: <Typography variant="body2">%</Typography>,
                    }}
                    inputProps={{
                      min: 0,
                      max: 100,
                      step: 1,
                    }}
                  />
                </Grid>

                {/* Delete Button - only show when more than one nominee */}
                {values.nominees.length > 1 && (
                  <Grid
                    item
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <IconButton onClick={() => remove(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            ))}

            {/* Total contribution error message */}
            {errors.nominees && typeof errors.nominees === "string" && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {errors.nominees}
              </Typography>
            )}

            {totalContribution > 100 && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                Total contribution exceeds 100%
              </Typography>
            )}

            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() =>
                  push({ name: "", relation: "", gender: "", contribution: "" })
                }
                disabled={values.nominees.length >= 5}
              >
                Add Nominee
              </Button>

              <Typography
                variant="body2"
                sx={{
                  color:
                    totalContribution > 100
                      ? "error.main"
                      : totalContribution === 100
                        ? "success.main"
                        : "text.secondary",
                }}
              >
                Total Contribution: {totalContribution}%
              </Typography>
            </Box>
          </>
        )}
      </FieldArray>
    </Box>
  );
};

export default StepSix;
