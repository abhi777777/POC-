// src/components/CreatePolicyForm/NomineeSection.jsx
import React from "react";
import {
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import { RemoveCircle, AddCircle } from "@mui/icons-material";

const NomineeSection = ({ formData, setFormData }) => {
  const handleNomineeChange = (index, field) => (e) => {
    const { value } = e.target;
    const nominees = [...formData.nominees];
    nominees[index][field] = value;
    setFormData((prev) => ({ ...prev, nominees }));
  };

  const addNominee = () => {
    setFormData((prev) => ({
      ...prev,
      nominees: [
        ...prev.nominees,
        { name: "", relation: "", gender: "", contribution: "" },
      ],
    }));
  };

  const removeNominee = (index) => {
    setFormData((prev) => ({
      ...prev,
      nominees: prev.nominees.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      <Typography variant="subtitle1">Nominees</Typography>
      {formData.nominees.map((nominee, idx) => (
        <Grid container spacing={2} alignItems="center" key={idx}>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Name"
              value={nominee.name}
              onChange={handleNomineeChange(idx, "name")}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Relation"
              value={nominee.relation}
              onChange={handleNomineeChange(idx, "relation")}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth required>
              <InputLabel id={`nominee-gender-${idx}`}>Gender</InputLabel>
              <Select
                labelId={`nominee-gender-${idx}`}
                value={nominee.gender}
                onChange={handleNomineeChange(idx, "gender")}
                label="Gender"
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Contribution"
              value={nominee.contribution}
              onChange={handleNomineeChange(idx, "contribution")}
              fullWidth
              required
            />
          </Grid>
          {idx > 0 && (
            <Grid item xs={12} sm={1}>
              <IconButton onClick={() => removeNominee(idx)} color="error">
                <RemoveCircle />
              </IconButton>
            </Grid>
          )}
        </Grid>
      ))}
      <Button
        type="button"
        variant="outlined"
        startIcon={<AddCircle />}
        onClick={addNominee}
        sx={{ alignSelf: "flex-start" }}
      >
        Add Nominee
      </Button>
    </>
  );
};

export default NomineeSection;
