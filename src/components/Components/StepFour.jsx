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
  Paper,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Card,
  CardContent,
  Fade,
} from "@mui/material";
import {
  InfoOutlined,
  SmokingRooms,
  LocalBar,
  Restaurant,
  Edit,
} from "@mui/icons-material";

const StepFour = ({ errors, touched }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { values, setFieldValue } = useFormikContext();

  // Set default values when component mounts
  React.useEffect(() => {
    const initializeLifestyleDefaults = () => {
      const lifestyleKeys = ["smoking", "drinking", "panMasala"];

      lifestyleKeys.forEach((key) => {
        if (!values.lifestyle[key]) {
          setFieldValue(`lifestyle.${key}`, {
            freq: "",
            quantity: "",
            uses: "no",
          });
        }
      });
    };

    initializeLifestyleDefaults();
  }, []);

  const handleLifestyleChange = (section, field) => (e) => {
    const { value } = e.target;
    setFieldValue(`lifestyle.${section}.${field}`, value);
  };

  const handleYesNoChange = (section) => (e) => {
    const value = e.target.value;
    if (value === "no") {
      setFieldValue(`lifestyle.${section}`, {
        freq: "",
        quantity: "",
        uses: "no",
      });
    } else {
      setFieldValue(`lifestyle.${section}`, {
        ...values.lifestyle[section],
        uses: "yes",
      });
    }
  };

  const lifestyleItems = [
    { key: "smoking", label: "Smoking", icon: <SmokingRooms color="action" /> },
    { key: "drinking", label: "Drinking", icon: <LocalBar color="action" /> },
    {
      key: "panMasala",
      label: "Pan Masala",
      icon: <Restaurant color="action" />,
    },
  ];

  const hasError = (section, field) =>
    touched.lifestyle?.[section]?.[field] &&
    errors.lifestyle?.[section]?.[field];

  const getErrorMessage = (section, field) =>
    hasError(section, field) ? errors.lifestyle[section][field] : "";

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(145deg, #2d2d2d 0%, #1f1f1f 100%)"
            : "linear-gradient(145deg, #f9f9f9 0%, #ffffff 100%)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: "bold",
          color: theme.palette.primary.main,
          display: "flex",
          alignItems: "center",
          "&:after": {
            content: '""',
            display: "block",
            height: "2px",
            background: theme.palette.primary.main,
            flex: 1,
            ml: 2,
            borderRadius: 1,
            opacity: 0.7,
          },
        }}
      >
        Lifestyle Information
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 2, fontStyle: "italic" }}
        >
          Please provide information about your lifestyle habits. This helps us
          better understand your health profile.
        </Typography>
      </Box>

      {lifestyleItems.map(({ key, label, icon }, index) => {
        const item = values.lifestyle[key] || { uses: "no" };
        return (
          <Card
            key={key}
            variant="outlined"
            sx={{
              mb: 3,
              borderRadius: 2,
              borderColor:
                item.uses === "yes"
                  ? theme.palette.primary.light
                  : theme.palette.divider,
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              },
            }}
          >
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    {icon}
                    <FormControl
                      component="fieldset"
                      sx={{
                        ml: 1,
                        flexGrow: 1,
                      }}
                    >
                      <FormLabel
                        sx={{ fontWeight: "medium", fontSize: "1.05rem" }}
                      >
                        {`Do you ${
                          key === "smoking"
                            ? "smoke"
                            : key === "drinking"
                              ? "drink alcohol"
                              : "consume pan masala"
                        }?`}
                      </FormLabel>
                      <RadioGroup
                        row
                        name={`lifestyle.${key}.uses`}
                        value={item.uses || "no"}
                        onChange={handleYesNoChange(key)}
                      >
                        <FormControlLabel
                          value="yes"
                          control={
                            <Radio
                              color="primary"
                              sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                            />
                          }
                          label={<Typography variant="body2">Yes</Typography>}
                        />
                        <FormControlLabel
                          value="no"
                          control={
                            <Radio
                              color="primary"
                              sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                            />
                          }
                          label={<Typography variant="body2">No</Typography>}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Collapse in={item.uses === "yes"}>
                    <Fade in={item.uses === "yes"} timeout={500}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 1,
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? "rgba(255,255,255,0.03)"
                              : "rgba(0,0,0,0.02)",
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <FormControl
                              fullWidth
                              error={hasError(key, "freq")}
                              variant="outlined"
                              size="small"
                            >
                              <FormLabel
                                sx={{
                                  mb: 1,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {`${label} Frequency`}
                                <Tooltip title="How often do you consume this?">
                                  <InfoOutlined
                                    fontSize="small"
                                    sx={{ ml: 1, fontSize: 16, opacity: 0.7 }}
                                  />
                                </Tooltip>
                              </FormLabel>
                              <RadioGroup
                                row={!isSmallScreen}
                                name={`lifestyle.${key}.freq`}
                                value={item.freq || ""}
                                onChange={handleLifestyleChange(key, "freq")}
                                sx={{
                                  justifyContent: isSmallScreen
                                    ? "flex-start"
                                    : "space-around",
                                }}
                              >
                                <FormControlLabel
                                  value="Daily"
                                  control={<Radio color="primary" />}
                                  label={
                                    <Typography variant="body2">
                                      Daily
                                    </Typography>
                                  }
                                />
                                <FormControlLabel
                                  value="Weekly"
                                  control={<Radio color="primary" />}
                                  label={
                                    <Typography variant="body2">
                                      Weekly
                                    </Typography>
                                  }
                                />
                              </RadioGroup>
                              {hasError(key, "freq") && (
                                <FormHelperText error>
                                  {getErrorMessage(key, "freq")}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              label={`${label} Quantity`}
                              name={`lifestyle.${key}.quantity`}
                              value={item.quantity || ""}
                              onChange={handleLifestyleChange(key, "quantity")}
                              type="number"
                              fullWidth
                              error={hasError(key, "quantity")}
                              helperText={getErrorMessage(key, "quantity")}
                              size="small"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <Typography
                                      variant="caption"
                                      color="textSecondary"
                                    >
                                      {key === "smoking"
                                        ? "per day"
                                        : key === "drinking"
                                          ? "drinks"
                                          : "servings"}
                                    </Typography>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Fade>
                  </Collapse>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      })}

      <Card
        variant="outlined"
        sx={{
          borderRadius: 2,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Edit color="action" />
            <Typography
              sx={{ ml: 1, fontWeight: "medium", fontSize: "1.05rem" }}
            >
              Other Habits
            </Typography>
          </Box>
          <TextField
            label="Any other habits we should know about?"
            name="lifestyle.others"
            value={values.lifestyle.others || ""}
            onChange={(e) => {
              setFieldValue("lifestyle.others", e.target.value);
            }}
            fullWidth
            multiline
            minRows={2}
            inputProps={{ maxLength: 150 }}
            placeholder="e.g., binge-watching, chewing gum, regular exercise..."
            error={!!(touched.lifestyle?.others && errors.lifestyle?.others)}
            helperText={
              touched.lifestyle?.others && errors.lifestyle?.others
                ? errors.lifestyle.others
                : `${(values.lifestyle.others || "").length}/150 characters`
            }
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, textAlign: "right" }}>
        <Typography variant="caption" color="textSecondary">
          All information provided will be kept confidential
        </Typography>
      </Box>
    </Paper>
  );
};

export default StepFour;
