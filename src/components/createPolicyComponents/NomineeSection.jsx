import React, { useEffect } from "react";
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
} from "@mui/material";
import { RemoveCircle, AddCircle } from "@mui/icons-material";

const relationOptions = [
  { value: "Father", gender: "male" },
  { value: "Mother", gender: "female" },
  { value: "Brother", gender: "male" },
  { value: "Sister", gender: "female" },
  { value: "Other", gender: "" },
];

const NomineeSection = ({ formData, setFormData, setStepValid }) => {
  const handleNomineeChange = (index, field) => (e) => {
    const { value } = e.target;
    const nominees = [...formData.nominees];
    nominees[index][field] = value;
    if (field === "relation" && value !== "Other") {
      const relationObj = relationOptions.find((opt) => opt.value === value);
      nominees[index].gender = relationObj.gender;
    }
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

  useEffect(() => {
    const isNomineesValid = formData.nominees.every(
      (nominee) =>
        nominee.name?.trim() &&
        nominee.relation &&
        nominee.gender &&
        nominee.contribution?.trim()
    );
    setStepValid(isNomineesValid);
  }, [formData.nominees, setStepValid]);

  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Nominees
      </Typography>
      {formData.nominees.map((nominee, idx) => (
        <Grid
          container
          spacing={2}
          alignItems="center"
          key={idx}
          sx={{ mb: 1 }}
        >
          <Grid item xs={12} sm={3}>
            <TextField
              label="Name"
              value={nominee.name}
              onChange={handleNomineeChange(idx, "name")}
              fullWidth
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth margin="normal">
              <InputLabel id={`nominee-relation-${idx}`}>Relation</InputLabel>
              <Select
                labelId={`nominee-relation-${idx}`}
                value={nominee.relation}
                onChange={handleNomineeChange(idx, "relation")}
                label="Relation"
              >
                {relationOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Gender"
              value={nominee.gender}
              onChange={handleNomineeChange(idx, "gender")}
              fullWidth
              required
              margin="normal"
              InputProps={{
                readOnly: nominee.relation !== "Other",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Contribution (%)"
              value={nominee.contribution}
              onChange={handleNomineeChange(idx, "contribution")}
              fullWidth
              required
              margin="normal"
            />
          </Grid>
          {idx > 0 && (
            <Grid item xs={12} sm={1}>
              <IconButton
                onClick={() => removeNominee(idx)}
                color="error"
                sx={{ mt: 2 }}
              >
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
        sx={{ alignSelf: "flex-start", mt: 2 }}
      >
        Add Nominee
      </Button>
    </>
  );
};

export default NomineeSection;
