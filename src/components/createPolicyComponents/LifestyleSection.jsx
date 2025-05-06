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
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLifestyleChange = (section, field) => (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      lifestyle: {
        ...prev.lifestyle,
        [section]: {
          ...prev.lifestyle[section],
          [field]: value,
        },
      },
    }));
  };

  const handleYesNoChange = (section) => (e) => {
    const value = e.target.value;
    if (value === "no") {
      setFormData((prev) => ({
        ...prev,
        lifestyle: {
          ...prev.lifestyle,
          [section]: {
            freq: "",
            quantity: "",
            uses: "no",
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        lifestyle: {
          ...prev.lifestyle,
          [section]: {
            ...prev.lifestyle[section],
            uses: "yes",
          },
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
      if (!item || item.uses === "no") return true;
      return item.uses === "yes" && item.freq && item.quantity;
    });

    const isOtherHabitsValid =
      !formData.lifestyle.others || formData.lifestyle.others.trim().length > 0;

    setStepValid(isEveryItemValid && isOtherHabitsValid);
  }, [formData.lifestyle, setStepValid]);

  return (
    <>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Lifestyle
      </Typography>

      {lifestyleItems.map(({ key, label }) => {
        const item = formData.lifestyle[key] || {};
        return (
          <Grid container spacing={2} key={key} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel>
                  {`Do you ${label === "Smoking" ? "smoke" : label === "Drinking" ? "drink" : label === "Pan Masala" ? "consume pan masala" : label.toLowerCase()}?`}
                </FormLabel>

                <RadioGroup
                  row
                  name={`${key}-uses`}
                  value={item.uses || ""}
                  onChange={handleYesNoChange(key)}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>

            {item.uses === "yes" && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <FormLabel>
                      {isSmallScreen ? "Frequency" : `${label} Frequency`}
                    </FormLabel>
                    <RadioGroup
                      row={!isSmallScreen}
                      name={`${key}-freq`}
                      value={item.freq || ""}
                      onChange={handleLifestyleChange(key, "freq")}
                    >
                      {["daily", "weekly"].map((option) => (
                        <FormControlLabel
                          key={option}
                          value={option}
                          control={<Radio />}
                          label={
                            option.charAt(0).toUpperCase() + option.slice(1)
                          }
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={isSmallScreen ? "Quantity" : `${label} Quantity`}
                    value={item.quantity || ""}
                    onChange={handleLifestyleChange(key, "quantity")}
                    type="number"
                    fullWidth
                  />
                </Grid>
              </>
            )}
          </Grid>
        );
      })}

      {/* Other Habits Section */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label={isSmallScreen ? "Other Habits" : "Any other"}
            value={formData.lifestyle.others || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                lifestyle: { ...prev.lifestyle, others: e.target.value },
              }))
            }
            fullWidth
            sx={{ width: "100%" }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default LifestyleSection;
