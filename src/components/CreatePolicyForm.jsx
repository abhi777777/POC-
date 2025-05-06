// src/CreatePolicyForm.jsx
import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { initialState } from "./createPolicyComponents/formState";
import BasicDetailsSection from "./createPolicyComponents/BasicDetailsSection";
import Summing from "./createPolicyComponents/Summing";
import BMISection from "./createPolicyComponents/BMISection.jsx";
import LifestyleSection from "./createPolicyComponents/LifestyleSection";
import MedicalHistorySection from "./createPolicyComponents/MedicalHistorySection";
import NomineeSection from "./createPolicyComponents/NomineeSection";
import AdditionalInfoSection from "./createPolicyComponents/AdditionalInfoSection";
import ReviewSection from "./createPolicyComponents/ReviewSection";

const steps = [
  "Basic Details",
  "Summing",
  "BMI Details",
  "Lifestyle",
  "Medical History",
  "Nominees",
  "Additional Info",
  "Review & Confirm",
];

export default function CreatePolicyForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [stepsValid, setStepsValid] = useState(Array(steps.length).fill(false));
  const [showReview, setShowReview] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    try {
      await axios.post(
        "http://localhost:4000/api/policy/CreatePolicies",
        {
          ...formData,
          medicalHistory: Array.isArray(formData.medicalHistory)
            ? formData.medicalHistory.join("; ")
            : formData.medicalHistory,
        },
        { withCredentials: true }
      );
      toast.success("Policy created successfully!");
      setFormData(initialState);
      setActiveStep(0);
      setStepsValid(Array(steps.length).fill(false));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error creating policy");
    }
  };

  // Full premium calculation function
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

    // The discount is applied to the premium, not the coverage amount
    const discountRate = tenure === 3 ? 0.1 : tenure === 2 ? 0.05 : 0;
    const discountedBase = Math.round(base * (1 - discountRate));

    return discountedBase + issueCharges;
  };

  const updateStepValid = (idx, valid) =>
    setStepsValid((prev) => {
      const clone = [...prev];
      clone[idx] = valid;
      return clone;
    });

  const sections = [
    <BasicDetailsSection
      key="basic"
      formData={formData}
      setFormData={setFormData}
      errors={errors}
      setErrors={setErrors}
      setStepValid={(v) => updateStepValid(0, v)}
    />,
    <Summing
      key="summing"
      formData={formData}
      setFormData={setFormData}
      setStepValid={(v) => updateStepValid(1, v)}
    />,
    <BMISection
      key="bmi"
      formData={formData}
      setFormData={setFormData}
      setStepValid={(v) => updateStepValid(2, v)}
    />,
    <LifestyleSection
      key="lifestyle"
      formData={formData}
      setFormData={setFormData}
      setStepValid={(v) => updateStepValid(3, v)}
    />,
    <MedicalHistorySection
      key="medical"
      formData={formData}
      setFormData={setFormData}
      setStepValid={(v) => updateStepValid(4, v)}
    />,
    <NomineeSection
      key="nominees"
      formData={formData}
      setFormData={setFormData}
      setStepValid={(v) => updateStepValid(5, v)}
    />,
    <AdditionalInfoSection
      key="additional"
      formData={formData}
      setFormData={setFormData}
      setStepValid={(v) => updateStepValid(6, v)}
    />,
    <Box key="review" />,
  ];

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        maxWidth: isMobile ? "95%" : 900,
        mx: "auto",
        p: isMobile ? 2 : 3,
      }}
    >
      <Typography variant="h6" align="center">
        Create New Policy
      </Typography>

      <Stepper
        activeStep={activeStep}
        alternativeLabel={!isMobile}
        orientation={isMobile ? "vertical" : "horizontal"}
        sx={{ mb: 2 }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {sections[activeStep]}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 2,
          flexDirection: isMobile ? "column-reverse" : "row",
          gap: isMobile ? 1 : 0,
        }}
      >
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ width: isMobile ? "100%" : "auto" }}
        >
          Back
        </Button>

        {activeStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={!stepsValid[activeStep]}
            sx={{ width: isMobile ? "100%" : "auto" }}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={() => {
              const premium = calculatePremium(formData);
              setFormData((prev) => ({ ...prev, premium })); // Save premium to form data
              setShowReview(true);
            }}
            variant="contained"
            sx={{ width: isMobile ? "100%" : "auto" }}
          >
            Review & Submit
          </Button>
        )}
      </Box>

      <ToastContainer position="bottom-right" />

      <ReviewSection
        open={showReview}
        onClose={() => setShowReview(false)}
        formData={formData}
        onConfirm={() => {
          setShowReview(false);
          handleSubmit();
        }}
      />
    </Box>
  );
}
