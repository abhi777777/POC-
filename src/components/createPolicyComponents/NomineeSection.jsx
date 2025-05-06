import React, { useState, useEffect } from "react";
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

const NomineeSection = ({ formData, setFormData, setStepValid }) => {
  const relationOptions = ["Father", "Mother", "Brother", "Sister", "Other"];
  const genderOptions = ["Male", "Female", "Other"];

  // Calculate total contribution
  const totalContribution = formData.nominees.reduce(
    (sum, nominee) => sum + Number(nominee.contribution || 0),
    0
  );

  useEffect(() => {
    const isNomineesFilled = formData.nominees.every(
      (nominee) =>
        nominee.name?.trim() &&
        nominee.relation &&
        nominee.gender &&
        nominee.contribution?.trim()
    );

    const isContributionValid = totalContribution === 100;

    setStepValid(isNomineesFilled && isContributionValid);
  }, [formData.nominees, totalContribution, setStepValid]);

  const handleNomineeChange = (index, field) => (e) => {
    const value = e.target.value;
    const updatedNominees = [...formData.nominees];
    updatedNominees[index][field] = value;

    // Auto-set gender based on relation
    if (field === "relation") {
      if (value === "Father" || value === "Brother") {
        updatedNominees[index].gender = "Male";
      } else if (value === "Mother" || value === "Sister") {
        updatedNominees[index].gender = "Female";
      } else {
        updatedNominees[index].gender = ""; // Allow manual selection
      }
    }

    setFormData((prev) => ({
      ...prev,
      nominees: updatedNominees,
    }));
  };

  const handleAddNominee = () => {
    const newNominee = {
      name: "",
      relation: "",
      gender: "",
      contribution: "",
    };
    setFormData((prev) => ({
      ...prev,
      nominees: [...prev.nominees, newNominee],
    }));
  };

  const handleRemoveNominee = (index) => () => {
    const updatedNominees = [...formData.nominees];
    updatedNominees.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      nominees: updatedNominees,
    }));
  };

  return (
    <Box sx={{ width: "100%" }}>
      {formData.nominees.map((nominee, idx) => (
        <Grid
          container
          key={idx}
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
              value={nominee.name}
              onChange={(e) => {
                const val = e.target.value;
                if (/^[A-Za-z ]*$/.test(val)) {
                  handleNomineeChange(idx, "name")(e);
                }
              }}
              fullWidth
              required
              size="medium"
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
              value={nominee.relation}
              onChange={handleNomineeChange(idx, "relation")}
              fullWidth
              required
              size="medium"
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
              value={nominee.gender}
              onChange={handleNomineeChange(idx, "gender")}
              fullWidth
              required
              size="medium"
              disabled={
                nominee.relation === "Father" ||
                nominee.relation === "Mother" ||
                nominee.relation === "Brother" ||
                nominee.relation === "Sister"
              }
            >
              {genderOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Contribution (full width) */}
          <Grid item>
            <TextField
              label="Contribution %"
              type="number"
              value={nominee.contribution}
              onChange={handleNomineeChange(idx, "contribution")}
              fullWidth
              required
              size="medium"
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

          {/* Delete Button aligned to the right */}
          <Grid item sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              onClick={handleRemoveNominee(idx)}
              color="error"
              disabled={formData.nominees.length <= 1}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}

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
          onClick={handleAddNominee}
          disabled={formData.nominees.length >= 5}
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
    </Box>
  );
};

export default NomineeSection;
