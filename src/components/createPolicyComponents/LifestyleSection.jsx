import React, { useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const LifestyleSection = ({ formData, setFormData, setStepValid }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // true on xs screens

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

  useEffect(() => {
    const isEveryItemValid = lifestyleItems.every(({ key }) => {
      const item = formData.lifestyle[key];
      if (!item?.freq && !item?.quantity) return true;
      return item?.freq && item?.quantity;
    });

    const isOtherHabitsValid =
      !formData.lifestyle.others || formData.lifestyle.others.trim().length > 0;

    setStepValid(isEveryItemValid && isOtherHabitsValid);
  }, [formData.lifestyle, setStepValid]);

  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Lifestyle
      </Typography>
      {lifestyleItems.map(({ key, label }) => (
        <Grid container spacing={2} key={key} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel>
                {isSmallScreen ? label : `${label} Frequency`}
              </FormLabel>
              <RadioGroup
                row={!isSmallScreen}
                name={`${key}-freq`}
                value={formData.lifestyle[key]?.freq || ""}
                onChange={handleLifestyleChange(key, "freq")}
              >
                <FormControlLabel
                  value="daily"
                  control={<Radio />}
                  label="Daily"
                />
                <FormControlLabel
                  value="weekly"
                  control={<Radio />}
                  label="Weekly"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label={isSmallScreen ? "Qty" : `${label} Quantity`}
              value={formData.lifestyle[key]?.quantity || ""}
              onChange={handleLifestyleChange(key, "quantity")}
              type="number"
              fullWidth
            />
          </Grid>
        </Grid>
      ))}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label={
              isSmallScreen ? "Other Habits" : "Other Lifestyle Habits (if any)"
            }
            value={formData.lifestyle.others || ""}
            onChange={handleLifestyleChange("others")}
            fullWidth
          />
        </Grid>
      </Grid>
    </>
  );
};

export default LifestyleSection;
