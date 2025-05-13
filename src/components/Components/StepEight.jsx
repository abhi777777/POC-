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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const StepEight = () => {
  const { values, setFieldValue, submitForm } = useFormikContext();
  const [openReview, setOpenReview] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);

  useEffect(() => {
    const calculatedPremium = calculatePremium({
      coverageAmount: values.coverageAmount,
      tenure: values.tenure,
      medicalHistory: values.medicalHistory,
      lifestyle: values.lifestyle,
    });

    if (calculatedPremium !== values.premium) {
      setFieldValue("premium", calculatedPremium);
    }
  }, [
    values.coverageAmount,
    values.tenure,
    values.medicalHistory,
    values.lifestyle,
    setFieldValue,
    values.premium,
  ]);

  const handleOpenReview = () => {
    setOpenReview(true);
  };

  const handleCloseReview = () => {
    setOpenReview(false);
  };

  const handleConfirm = async () => {
    setOpenReview(false);
    try {
      await submitForm();
      setSubmissionComplete(true);
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };

  const calculatePremium = ({
    coverageAmount,
    tenure,
    medicalHistory,
    lifestyle,
  }) => {
    const cov = Number(coverageAmount) || 0;
    let base;
    if (cov <= 500_000) base = 3_000;
    else if (cov <= 1_000_000) base = 5_000;
    else if (cov <= 1_500_000) base = 10_000;
    else if (cov <= 2_000_000) base = 15_000;
    else if (cov <= 2_500_000) base = 20_000;
    else {
      const extraBrackets = Math.min(
        Math.floor((cov - 2_500_000) / 500_000) + 1,
        5
      );
      base = 20_000 + extraBrackets * 5_000;
    }
    const medCount = Array.isArray(medicalHistory)
      ? medicalHistory.filter((x) => Boolean(x)).length
      : 0;
    const lifeKeys = ["smoking", "drinking", "panMasala", "others"];
    const lifeCount = lifeKeys.reduce((sum, key) => {
      const entry = lifestyle?.[key];
      if (!entry) return sum;
      return (
        sum + (key === "others" ? 1 : entry.freq || entry.quantity ? 1 : 0)
      );
    }, 0);
    const issueCharges = (medCount + lifeCount) * 750;
    const discountRate = tenure === 3 ? 0.1 : tenure === 2 ? 0.05 : 0;
    const discountedBase = Math.round(base * (1 - discountRate));
    return discountedBase + issueCharges;
  };

  const baseCoverage = Number(values.coverageAmount) || 0;
  const tenureDiscount = values.tenure === 3 ? 10 : values.tenure === 2 ? 5 : 0;

  // Format currency values
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (submissionComplete) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CheckCircleIcon sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Submission Complete!
        </Typography>
        <Typography variant="body1">
          Your policy application has been submitted successfully.
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          A confirmation has been sent to your email: {values.email}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" gutterBottom>
        Review Your Policy
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Please review your policy details before submission.
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
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

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Policy Details
        </Typography>
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
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Tenure Discount</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {tenureDiscount}%
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2">Premium Amount</Typography>
            <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
              {formatCurrency(values.premium)}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Nominees
        </Typography>
        {values.nominees.map((nominee, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="subtitle2">
              {nominee.name} ({nominee.relation})
            </Typography>
            <Typography variant="body2">
              Contribution: {nominee.contribution}%
            </Typography>
          </Box>
        ))}
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleOpenReview}
        >
          Review and Submit
        </Button>
      </Box>

      {/* Review Dialog */}
      <Dialog open={openReview} onClose={handleCloseReview}>
        <DialogTitle>Review Policy Details</DialogTitle>
        <DialogContent>
          <Paper sx={{ p: 2 }}>
            <Box mb={2}>
              <Typography variant="h6">
                Coverage Amount: {formatCurrency(baseCoverage)}
              </Typography>
              <Typography variant="body1">
                Tenure: {values.tenure} Years
              </Typography>
              <Typography variant="body1">
                Discount: {tenureDiscount}% off
              </Typography>
              <Typography variant="h6">
                Total Premium: {formatCurrency(values.premium)}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              By confirming, you agree to the terms and conditions of the
              policy.
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReview} color="secondary">
            Close
          </Button>
          <Button onClick={handleConfirm} variant="contained">
            Confirm and Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StepEight;
