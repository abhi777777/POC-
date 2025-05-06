import React, { useEffect } from "react";
import {
  Typography,
  TextField,
  Grid,
  IconButton,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

const MedicalHistorySection = ({ formData, setFormData, setStepValid }) => {
  const hasHistory = formData.hasMedicalHistory === "yes";

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

  const handleYesNoChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      hasMedicalHistory: value,
      medicalHistory: value === "yes" ? [""] : [],
    }));
  };

  useEffect(() => {
    if (formData.hasMedicalHistory === "no") {
      setStepValid(true);
    } else if (
      formData.hasMedicalHistory === "yes" &&
      formData.medicalHistory.some((cond) => cond.trim() !== "")
    ) {
      setStepValid(true);
    } else {
      setStepValid(false);
    }
  }, [formData.hasMedicalHistory, formData.medicalHistory, setStepValid]);

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Medical History
      </Typography>

      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel>Do you have any past medical conditions?</FormLabel>
        <RadioGroup
          row
          name="hasMedicalHistory"
          value={formData.hasMedicalHistory || ""}
          onChange={handleYesNoChange}
        >
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      {hasHistory &&
        formData.medicalHistory.map((entry, idx) => (
          <Grid item xs={12} sx={{ position: "relative", mb: 2 }}>
            <TextField
              label={`Condition `}
              value={entry}
              onChange={handleEntryChange(idx)}
              fullWidth
              multiline
              rows={2}
            />
            {idx > 0 && (
              <IconButton
                color="error"
                onClick={() => removeEntry(idx)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                }}
              >
                <RemoveCircle />
              </IconButton>
            )}
          </Grid>
        ))}

      {hasHistory && (
        <Button
          type="button"
          variant="outlined"
          startIcon={<AddCircle />}
          onClick={addEntry}
        >
          Add Condition
        </Button>
      )}
    </>
  );
};

export default MedicalHistorySection;
