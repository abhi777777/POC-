import React, { useState, useEffect } from "react";
import { useFormikContext } from "formik";
import {
  Typography,
  Box,
  Paper,
  Divider,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Info as InfoIcon,
  Assignment as AssignmentIcon,
  InfoOutlined,
  ReceiptLong as ReceiptIcon,
  AttachMoney as MoneyIcon,
  EmojiPeople as PeopleIcon,
  HealthAndSafety as HealthIcon,
} from "@mui/icons-material";

const StepEight = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { values, setFieldValue, submitForm } = useFormikContext();
  const [openReview, setOpenReview] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [premiumBreakdown, setPremiumBreakdown] = useState({
    base: 0,
    medicalCharges: 0,
    lifestyleCharges: 0,
    subtotal: 0,
    discountRate: 0,
    finalPremium: 0,
  });

  // Recalculate premium when inputs change
  useEffect(() => {
    const breakdown = calculatePremiumWithBreakdown({
      coverageAmount: values.coverageAmount,
      tenure: values.tenure,
      medicalHistory: values.medicalHistory,
      lifestyle: values.lifestyle,
    });

    setPremiumBreakdown(breakdown);

    if (breakdown.finalPremium !== values.premium) {
      setFieldValue("premium", breakdown.finalPremium);
    }
  }, [
    values.coverageAmount,
    values.tenure,
    values.medicalHistory,
    values.lifestyle,
    setFieldValue,
  ]);

  const handleOpenReview = () => setOpenReview(true);
  const handleCloseReview = () => setOpenReview(false);

  const handleConfirm = async () => {
    handleCloseReview();
    try {
      await submitForm();
      setSubmissionComplete(true);
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };

  // Premium calculation with detailed breakdown
  const calculatePremiumWithBreakdown = ({
    coverageAmount,
    tenure,
    medicalHistory,
    lifestyle,
  }) => {
    const cov = Number(coverageAmount) || 0;
    let base;
    if (cov <= 500000) base = 3000;
    else if (cov <= 1000000) base = 5000;
    else if (cov <= 1500000) base = 10000;
    else if (cov <= 2000000) base = 15000;
    else if (cov <= 2500000) base = 20000;
    else {
      const extra = Math.min(Math.floor((cov - 2500000) / 500000) + 1, 5);
      base = 20000 + extra * 5000;
    }

    // Medical charges: 750 per reported condition
    const medCount = Array.isArray(medicalHistory)
      ? medicalHistory.filter((x) => x.trim()).length
      : 0;
    const medicalCharges = medCount * 750;

    // Lifestyle charges: flat 750 per non-empty habit
    let lifestyleCharges = 0;
    if (lifestyle?.smoking?.freq) lifestyleCharges += 750;
    if (lifestyle?.drinking?.freq) lifestyleCharges += 750;
    if (lifestyle?.panMasala?.freq) lifestyleCharges += 750;
    if (lifestyle?.others && lifestyle.others.trim()) lifestyleCharges += 750;

    // Total before discount
    const subtotal = base + medicalCharges + lifestyleCharges;

    // Tenure discount: 5% for 2 yrs, 10% for 3 yrs
    const discountRate = tenure === 3 ? 0.1 : tenure === 2 ? 0.05 : 0;
    const finalPremium = Math.round(subtotal * (1 - discountRate));

    return {
      base,
      medicalCharges,
      lifestyleCharges,
      subtotal,
      discountRate,
      finalPremium,
    };
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const baseCoverage = Number(values.coverageAmount) || 0;
  const tenureDiscount = values.tenure === 3 ? 10 : values.tenure === 2 ? 5 : 0;

  const getLifestyleFactors = () => {
    const factors = [];
    if (values.lifestyle?.smoking?.freq)
      factors.push(`Smoking: ${values.lifestyle.smoking.freq}`);
    if (values.lifestyle?.drinking?.freq)
      factors.push(`Drinking: ${values.lifestyle.drinking.freq}`);
    if (values.lifestyle?.panMasala?.freq)
      factors.push(`Pan Masala/Tobacco: ${values.lifestyle.panMasala.freq}`);
    if (values.lifestyle?.others)
      factors.push(`Other factors: ${values.lifestyle.others}`);
    return factors.length ? factors : ["None"];
  };

  const getMedicalConditions = () =>
    Array.isArray(values.medicalHistory) &&
    values.medicalHistory.filter((x) => x.trim()).length
      ? values.medicalHistory.filter((x) => x.trim())
      : ["None reported"];

  if (submissionComplete) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          textAlign: "center",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(145deg, #2d2d2d 0%, #1f1f1f 100%)"
              : "linear-gradient(145deg, #f9f9f9 0%, #ffffff 100%)",
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Submission Complete!
        </Typography>
        <Typography>
          Your policy application has been submitted successfully.
        </Typography>
      </Paper>
    );
  }

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
        Review Your Policy
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 2, fontStyle: "italic" }}
        >
          Please review your policy details carefully before submission. Ensure
          all information is accurate.
        </Typography>
      </Box>

      {/* Personal Information Card */}
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
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <PeopleIcon color="action" />
            <Typography
              sx={{ ml: 1, fontWeight: "medium", fontSize: "1.05rem" }}
            >
              Personal Information
            </Typography>
            <Tooltip title="Your personal details used for this policy">
              <InfoOutlined
                fontSize="small"
                sx={{ ml: 1, opacity: 0.7, fontSize: 16 }}
              />
            </Tooltip>
          </Box>

          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(0,0,0,0.01)",
              border: `1px solid ${
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)"
              }`,
              position: "relative",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Name</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {values.title} {values.firstName} {values.middleName}{" "}
                  {values.lastName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Contact</Typography>
                <Typography variant="body1">{values.email}</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {values.mobile}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Date of Birth</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {values.dob instanceof Date
                    ? values.dob.toLocaleDateString()
                    : values.dob}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Gender</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {values.gender}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Policy Details Card */}
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
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <AssignmentIcon color="action" />
            <Typography
              sx={{ ml: 1, fontWeight: "medium", fontSize: "1.05rem" }}
            >
              Policy Details
            </Typography>
            <Tooltip title="Your selected coverage amount and policy tenure">
              <InfoOutlined
                fontSize="small"
                sx={{ ml: 1, opacity: 0.7, fontSize: 16 }}
              />
            </Tooltip>
          </Box>

          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(0,0,0,0.01)",
              border: `1px solid ${
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)"
              }`,
              position: "relative",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Coverage Amount</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {formatCurrency(baseCoverage)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Tenure</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {values.tenure} Years
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Premium Breakdown Card */}
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
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <MoneyIcon color="action" />
            <Typography
              sx={{ ml: 1, fontWeight: "medium", fontSize: "1.05rem" }}
            >
              Premium Breakdown
            </Typography>
            <Tooltip title="Detailed breakdown of your premium calculation">
              <InfoOutlined
                fontSize="small"
                sx={{ ml: 1, opacity: 0.7, fontSize: 16 }}
              />
            </Tooltip>
          </Box>

          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(0,0,0,0.01)",
              border: `1px solid ${
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)"
              }`,
              position: "relative",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Base Premium</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {formatCurrency(premiumBreakdown.base)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Medical Charges</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {formatCurrency(premiumBreakdown.medicalCharges)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Lifestyle Charges</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {formatCurrency(premiumBreakdown.lifestyleCharges)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Subtotal</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {formatCurrency(premiumBreakdown.subtotal)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Tenure Discount</Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {tenureDiscount}% (
                  {formatCurrency(
                    premiumBreakdown.subtotal * premiumBreakdown.discountRate
                  )}
                  )
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Final Premium</Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="primary"
                  sx={{ mb: 1 }}
                >
                  {formatCurrency(premiumBreakdown.finalPremium)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Health & Lifestyle Card */}
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
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <HealthIcon color="action" />
            <Typography
              sx={{ ml: 1, fontWeight: "medium", fontSize: "1.05rem" }}
            >
              Health & Lifestyle Factors
            </Typography>
            <Tooltip title="Health and lifestyle information affecting your premium">
              <InfoOutlined
                fontSize="small"
                sx={{ ml: 1, opacity: 0.7, fontSize: 16 }}
              />
            </Tooltip>
          </Box>

          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(0,0,0,0.01)",
              border: `1px solid ${
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)"
              }`,
              position: "relative",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Lifestyle</Typography>
                {getLifestyleFactors().map((factor, idx) => (
                  <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                    • {factor}
                  </Typography>
                ))}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Medical Conditions</Typography>
                {getMedicalConditions().map((condition, idx) => (
                  <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                    • {condition}
                  </Typography>
                ))}
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Nominees Card */}
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
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <PeopleIcon color="action" />
            <Typography
              sx={{ ml: 1, fontWeight: "medium", fontSize: "1.05rem" }}
            >
              Nominees
            </Typography>
            <Tooltip title="Your nominated beneficiaries for this policy">
              <InfoOutlined
                fontSize="small"
                sx={{ ml: 1, opacity: 0.7, fontSize: 16 }}
              />
            </Tooltip>
          </Box>

          <Box
            sx={{
              mb: 1,
              p: 2,
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(0,0,0,0.01)",
              border: `1px solid ${
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)"
              }`,
              position: "relative",
            }}
          >
            {values.nominees.map((nominee, index) => (
              <Box
                key={index}
                sx={{ mb: index < values.nominees.length - 1 ? 2 : 0 }}
              >
                <Typography variant="subtitle2">
                  {nominee.name} ({nominee.relation})
                </Typography>
                <Typography variant="body2">
                  Contribution: {nominee.contribution}%
                </Typography>
                {index < values.nominees.length - 1 && (
                  <Divider sx={{ my: 1 }} />
                )}
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 1,
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(200, 230, 201, 0.05)"
              : "rgba(200, 230, 201, 0.2)",
          border: `1px solid ${theme.palette.mode === "dark" ? "rgba(200, 230, 201, 0.1)" : "rgba(200, 230, 201, 0.4)"}`,
        }}
      >
        <Typography variant="body2" color="textSecondary">
          <strong>Please note:</strong> By submitting this application, you
          confirm that all provided information is accurate and complete. Once
          submitted, your policy will be processed based on the details provided
          here.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleOpenReview}
          sx={{
            px: 4,
            py: 1,
            fontWeight: "medium",
            borderRadius: 1.5,
            boxShadow: 2,
          }}
        >
          Review and Submit
        </Button>
      </Box>

      <Box sx={{ mt: 3, textAlign: "right" }}>
        <Typography variant="caption" color="textSecondary">
          Please review all information carefully before submission
        </Typography>
      </Box>

      <Dialog
        open={openReview}
        onClose={handleCloseReview}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            fontWeight: "medium",
            color: theme.palette.primary.main,
          }}
        >
          Final Review
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Coverage Amount: {formatCurrency(baseCoverage)}
            </Typography>
            <Typography variant="body1">
              Tenure: {values.tenure} Years
            </Typography>

            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 1,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.01)",
                border: `1px solid ${
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)"
                }`,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Premium Calculation
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <Typography variant="body2">Base premium</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "right" }}>
                  <Typography variant="body2">
                    {formatCurrency(premiumBreakdown.base)}
                  </Typography>
                </Grid>

                <Grid item xs={8}>
                  <Typography variant="body2">
                    Medical conditions charges
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "right" }}>
                  <Typography variant="body2">
                    {formatCurrency(premiumBreakdown.medicalCharges)}
                  </Typography>
                </Grid>

                <Grid item xs={8}>
                  <Typography variant="body2">
                    Lifestyle factors charges
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "right" }}>
                  <Typography variant="body2">
                    {formatCurrency(premiumBreakdown.lifestyleCharges)}
                  </Typography>
                </Grid>

                <Grid item xs={8}>
                  <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                    Subtotal
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "right" }}>
                  <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                    {formatCurrency(premiumBreakdown.subtotal)}
                  </Typography>
                </Grid>

                {tenureDiscount > 0 && (
                  <>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        Discount ({tenureDiscount}%)
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: "right" }}>
                      <Typography variant="body2">
                        -
                        {formatCurrency(
                          premiumBreakdown.subtotal *
                            premiumBreakdown.discountRate
                        )}
                      </Typography>
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={8}>
                  <Typography variant="subtitle1">Final Premium</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "right" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                    }}
                  >
                    {formatCurrency(premiumBreakdown.finalPremium)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="text.secondary">
            By confirming, you agree to the terms and conditions of the policy.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}
        >
          <Button onClick={handleCloseReview} color="secondary">
            Close
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="primary"
            sx={{ fontWeight: "medium" }}
          >
            Confirm and Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default StepEight;
