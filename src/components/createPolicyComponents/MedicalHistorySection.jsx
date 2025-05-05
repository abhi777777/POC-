import React, { useEffect } from "react";
import { Typography, TextField, Grid, IconButton, Button } from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

const MedicalHistorySection = ({ formData, setFormData, setStepValid }) => {
  const handleEntryChange = (index) => (e) => {
    const { value } = e.target;
    const entries = [...formData.medicalHistory];
    entries[index] = value;
    setFormData((prev) => ({ ...prev, medicalHistory: entries }));
  };

  const addEntry = () => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: [...prev.medicalHistory, ""],
    }));
  };

  const removeEntry = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: prev.medicalHistory.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    setStepValid(true);
  }, [formData.medicalHistory, setStepValid]);

  return (
    <>
      <Typography variant="subtitle1">Medical History</Typography>
      {formData.medicalHistory.map((entry, idx) => (
        <Grid
          container
          spacing={2}
          alignItems="center"
          key={idx}
          sx={{ mb: 1 }}
        >
          <Grid item xs={11}>
            <TextField
              label={`Condition ${idx + 1}`}
              value={entry}
              onChange={handleEntryChange(idx)}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={1}>
            {idx > 0 && (
              <IconButton color="error" onClick={() => removeEntry(idx)}>
                <RemoveCircle />
              </IconButton>
            )}
          </Grid>
        </Grid>
      ))}
      <Button
        type="button"
        variant="outlined"
        startIcon={<AddCircle />}
        onClick={addEntry}
      >
        Add Condition
      </Button>
    </>
  );
};

export default MedicalHistorySection;
