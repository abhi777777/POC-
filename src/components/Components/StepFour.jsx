import React from "react";
import { useFormikContext } from "formik";
import {
  Grid,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Collapse,
  Tooltip,
  useMediaQuery,
  useTheme,
  FormHelperText,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { toast } from "react-toastify"; // ← import toast

const StepFour = ({ errors, touched }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { values, setFieldValue } = useFormikContext();

  const handleLifestyleChange = (section, field) => (e) => {
    const { value } = e.target;
    setFieldValue(`lifestyle.${section}.${field}`, value);

    // If they set frequency or quantity, you can toast a quick acknowledgement
    toast.info(
      `${section.charAt(0).toUpperCase() + section.slice(1)} ${
        field === "freq" ? "frequency" : "quantity"
      } set to ${value}`
    );
  };

  const handleYesNoChange = (section) => (e) => {
    const value = e.target.value;
    if (value === "no") {
      setFieldValue(`lifestyle.${section}`, {
        freq: "",
        quantity: "",
        uses: "no",
      });
      toast.success(`Got it—no ${section} for you! 🎉`);
    } else {
      setFieldValue(`lifestyle.${section}`, {
        ...values.lifestyle[section],
        uses: "yes",
      });
      toast.info(`Okay, you ${section} — let’s get some details!`);
    }
  };

  const lifestyleItems = [
    { key: "smoking", label: "Smoking 🚬" },
    { key: "drinking", label: "Drinking 🍺" },
    { key: "panMasala", label: "Pan Masala 🌿" },
  ];

  const hasError = (section, field) =>
    touched.lifestyle?.[section]?.[field] &&
    errors.lifestyle?.[section]?.[field];

  const getErrorMessage = (section, field) =>
    hasError(section, field) ? errors.lifestyle[section][field] : "";

  return (
    <>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Lifestyle
      </Typography>

      {lifestyleItems.map(({ key, label }) => {
        const item = values.lifestyle[key] || {};
        return (
          <Grid container spacing={2} key={key} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel>
                  {`Do you ${
                    key === "smoking"
                      ? "smoke"
                      : key === "drinking"
                        ? "drink"
                        : "consume pan masala"
                  }?`}
                </FormLabel>
                <RadioGroup
                  row
                  name={`lifestyle.${key}.uses`}
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

            <Collapse in={item.uses === "yes"} style={{ width: "100%" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={hasError(key, "freq")}>
                    <FormLabel>
                      {isSmallScreen ? "Frequency" : `${label} Frequency`}
                      <Tooltip title="How often?">
                        <InfoOutlined
                          fontSize="small"
                          sx={{ ml: 1, verticalAlign: "middle" }}
                        />
                      </Tooltip>
                    </FormLabel>
                    <RadioGroup
                      row={!isSmallScreen}
                      name={`lifestyle.${key}.freq`}
                      value={item.freq || ""}
                      onChange={handleLifestyleChange(key, "freq")}
                    >
                      <FormControlLabel
                        value="Daily"
                        control={<Radio />}
                        label="Daily"
                      />
                      <FormControlLabel
                        value="Weekly"
                        control={<Radio />}
                        label="Weekly"
                      />
                    </RadioGroup>
                    {hasError(key, "freq") && (
                      <FormHelperText>
                        {getErrorMessage(key, "freq")}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label={isSmallScreen ? "Quantity" : `${label} Quantity`}
                    name={`lifestyle.${key}.quantity`}
                    value={item.quantity || ""}
                    onChange={handleLifestyleChange(key, "quantity")}
                    type="number"
                    fullWidth
                    error={hasError(key, "quantity")}
                    helperText={getErrorMessage(key, "quantity")}
                  />
                </Grid>
              </Grid>
            </Collapse>
          </Grid>
        );
      })}

      {/* Other Habits */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label={isSmallScreen ? "Other Habits" : "Any other habits? 🧠"}
            name="lifestyle.others"
            value={values.lifestyle.others || ""}
            onChange={(e) => {
              setFieldValue("lifestyle.others", e.target.value);
              toast.info(`Other habits updated: "${e.target.value}"`);
            }}
            fullWidth
            multiline
            minRows={2}
            inputProps={{ maxLength: 150 }}
            placeholder="e.g., binge-watching, chewing gum…"
            error={!!(touched.lifestyle?.others && errors.lifestyle?.others)}
            helperText={
              touched.lifestyle?.others && errors.lifestyle?.others
                ? errors.lifestyle.others
                : `${(values.lifestyle.others || "").length}/150`
            }
          />
        </Grid>
      </Grid>
    </>
  );
};

export default StepFour;
