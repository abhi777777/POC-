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

  const updateStepValid = (index, valid) =>
    setStepsValid((prev) => {
      const copy = [...prev];
      copy[index] = valid;
      return copy;
    });

  const sections = [
    <BasicDetailsSection
      key="basic"
      formData={formData}
      setFormData={setFormData}
      errors={errors}
      setErrors={setErrors}
      setStepValid={(valid) => updateStepValid(0, valid)}
    />,
    <Summing
      key="summing"
      formData={formData}
      setFormData={setFormData}
      setStepValid={(valid) => updateStepValid(1, valid)}
    />,
    <BMISection
      key="bmi"
      formData={formData}
      setFormData={setFormData}
      setStepValid={(valid) => updateStepValid(2, valid)}
    />,
    <LifestyleSection
      key="lifestyle"
      formData={formData}
      setFormData={setFormData}
      setStepValid={(valid) => updateStepValid(3, valid)}
    />,
    <MedicalHistorySection
      key="medical"
      formData={formData}
      setFormData={setFormData}
      setStepValid={(valid) => updateStepValid(4, valid)}
    />,
    <NomineeSection
      key="nominees"
      formData={formData}
      setFormData={setFormData}
      setStepValid={(valid) => updateStepValid(5, valid)}
    />,
    <AdditionalInfoSection
      key="additional"
      formData={formData}
      setFormData={setFormData}
      setStepValid={(valid) => updateStepValid(6, valid)}
    />,
    // Placeholder for review step (actual content is in the modal)
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
        padding: isMobile ? 2 : 3,
      }}
    >
      <Typography variant="h6" align="center" gutterBottom>
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

      <Box sx={{ mb: 2 }}>{sections[activeStep]}</Box>

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
          type="button"
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
            onClick={() => setShowReview(true)}
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
        onConfirm={(premium) => {
          setFormData((prev) => ({
            ...prev,
            premium,
          }));
          setShowReview(false);
          handleSubmit();
        }}
      />
    </Box>
  );
}
