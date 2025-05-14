import React from "react";
import { useFormikContext } from "formik";
import {
  Grid,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  Box,
  Card,
  CardContent,
  Tooltip,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  InfoOutlined,
  MonetizationOn,
  AccessTime,
  DiscountOutlined,
} from "@mui/icons-material";

const StepThree = ({ errors, touched }) => {
  const { values, handleChange, handleBlur } = useFormikContext();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Calculate discount
  const getDiscount = () => {
    if (values.tenure === 2) return 5;
    if (values.tenure === 3) return 10;
    return 0;
  };

  const discount = getDiscount();

  // Calculate discounted amount if applicable
  const calculateDiscountedAmount = () => {
    if (!values.coverageAmount) return null;

    const baseAmount = parseFloat(values.coverageAmount);
    if (discount > 0) {
      const discountAmount = baseAmount * (discount / 100);
      return (baseAmount - discountAmount).toFixed(2);
    }
    return null;
  };

  const discountedAmount = calculateDiscountedAmount();

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
        Coverage Details
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 2, fontStyle: "italic" }}
        >
          Please select your desired coverage amount and policy tenure. Longer
          tenure plans come with special discounts: 5% off for 2-year plans and
          10% off for 3-year plans.
        </Typography>
      </Box>

      <Card
        variant="outlined"
        sx={{
          mb: 3,
          borderRadius: 2,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <MonetizationOn color="action" />
            <Typography
              sx={{ ml: 1, fontWeight: "medium", fontSize: "1.05rem" }}
            >
              Coverage Amount
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="coverageAmount"
                label="Coverage Amount"
                type="number"
                value={values.coverageAmount || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.coverageAmount && Boolean(errors.coverageAmount)}
                helperText={
                  (touched.coverageAmount && errors.coverageAmount) ||
                  "Enter between ₹3L and ₹50L"
                }
                fullWidth
                required
                size="small"
                inputProps={{ min: 300000, max: 5000000 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography variant="body2">₹</Typography>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="The total coverage amount you'd like for your policy">
                        <InfoOutlined
                          fontSize="small"
                          sx={{ opacity: 0.7, fontSize: 16 }}
                        />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        sx={{
          mb: 3,
          borderRadius: 2,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <AccessTime color="action" />
            <Typography
              sx={{ ml: 1, fontWeight: "medium", fontSize: "1.05rem" }}
            >
              Policy Tenure
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                size="small"
                error={touched.tenure && Boolean(errors.tenure)}
                sx={{ minHeight: "56px" }}
              >
                <InputLabel
                  id="tenure-label"
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#1f1f1f" : "#fff",
                    px: 0.5,
                    "&.MuiInputLabel-shrink": {
                      bgcolor:
                        theme.palette.mode === "dark" ? "#1f1f1f" : "#fff",
                    },
                  }}
                >
                  Policy Tenure
                </InputLabel>
                <Select
                  labelId="tenure-label"
                  name="tenure"
                  value={values.tenure || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Policy Tenure"
                  sx={{
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                      paddingY: 1.5,
                    },
                  }}
                  startAdornment={
                    <InputAdornment position="start" sx={{ ml: 1, mr: 1 }}>
                      <Tooltip title="Longer tenure plans offer special discounts">
                        <InfoOutlined
                          fontSize="small"
                          sx={{ opacity: 0.7, fontSize: 16 }}
                        />
                      </Tooltip>
                    </InputAdornment>
                  }
                >
                  <MenuItem value={1}>
                    <Box
                      sx={{ py: 0.5, display: "flex", alignItems: "center" }}
                    >
                      1 Year
                    </Box>
                  </MenuItem>
                  <MenuItem value={2}>
                    <Box
                      sx={{
                        py: 0.5,
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <span>2 Years</span>
                      <Typography
                        component="span"
                        sx={{
                          color: "green",
                          fontWeight: 500,
                          ml: "auto",
                          fontSize: "0.875rem",
                        }}
                      >
                        (5% off)
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value={3}>
                    <Box
                      sx={{
                        py: 0.5,
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <span>3 Years</span>
                      <Typography
                        component="span"
                        sx={{
                          color: "green",
                          fontWeight: 500,
                          ml: "auto",
                          fontSize: "0.875rem",
                        }}
                      >
                        (10% off)
                      </Typography>
                    </Box>
                  </MenuItem>
                </Select>
                {touched.tenure && errors.tenure && (
                  <Typography color="error" variant="caption">
                    {errors.tenure}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {discount > 0 && (
        <Card
          variant="outlined"
          sx={{
            borderRadius: 2,
            borderColor: theme.palette.success.light,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(76, 175, 80, 0.08)"
                : "rgba(76, 175, 80, 0.05)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            },
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <DiscountOutlined color="success" />
              <Typography
                sx={{
                  ml: 1,
                  fontWeight: "medium",
                  fontSize: "1.05rem",
                  color: theme.palette.success.main,
                }}
              >
                Discount Applied
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(76, 175, 80, 0.12)"
                        : "rgba(76, 175, 80, 0.08)",
                    border: `1px dashed ${theme.palette.success.main}`,
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                    Congratulations! You get a {discount}% discount on your
                    premium.
                  </Typography>

                  {values.coverageAmount && (
                    <Box sx={{ mt: 2 }}>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">
                            Original Amount:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "medium" }}
                          >
                            ₹{Number(values.coverageAmount).toLocaleString()}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">
                            Discount Applied:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "medium",
                              color: theme.palette.success.main,
                            }}
                          >
                            {discount}%
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">
                  Note: Discounts are applied automatically at checkout and
                  cannot be combined with other promotions.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Box sx={{ mt: 3, textAlign: "right" }}>
        <Typography variant="caption" color="textSecondary">
          All prices are inclusive of applicable taxes and fees
        </Typography>
      </Box>
    </Paper>
  );
};

export default StepThree;
