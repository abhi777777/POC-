// src/components/CreatePolicyForm/LifestyleSection.jsx
import React from "react";
import { Grid, Typography, TextField } from "@mui/material";

const LifestyleSection = ({ formData, setFormData }) => {
  const handleLifestyleChange = (section, field) => (e) => {
    const { value } = e.target;
    if (!field) {
      setFormData((prev) => ({
        ...prev,
        lifestyle: { ...prev.lifestyle, [section]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        lifestyle: {
          ...prev.lifestyle,
          [section]: { ...prev.lifestyle[section], [field]: value },
        },
      }));
    }
  };

  const lifestyleItems = [
    { key: "smoking", label: "Smoking" },
    { key: "drinking", label: "Drinking" },
    { key: "panMasala", label: "Pan Masala" },
  ];

  return (
    <>
      <Typography variant="subtitle1">Lifestyle</Typography>
      <Grid container spacing={2}>
        {lifestyleItems.map(({ key, label }) => (
          <React.Fragment key={key}>
            <Grid item xs={12} sm={3}>
              <TextField
                label={`${label} Freq`}
                value={formData.lifestyle[key].freq}
                onChange={handleLifestyleChange(key, "freq")}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Quantity"
                value={formData.lifestyle[key].quantity}
                onChange={handleLifestyleChange(key, "quantity")}
                fullWidth
              />
            </Grid>
          </React.Fragment>
        ))}
        <Grid item xs={12}>
          <TextField
            label="Other Habits"
            value={formData.lifestyle.others}
            onChange={handleLifestyleChange("others")}
            fullWidth
          />
        </Grid>
      </Grid>
    </>
  );
};

export default LifestyleSection;
