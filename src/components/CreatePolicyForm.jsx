import React, { useState } from "react";
import axios from "axios";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Typography,
  Container,
  Paper,
  Stack,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Divider,
  useTheme,
  useMediaQuery,
  MobileStepper,
  StepContent,
  Grid,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import CheckIcon from "@mui/icons-material/Check";
import ReplayIcon from "@mui/icons-material/Replay";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// Import all step components (placeholder for your existing components)
import StepOne from "./Components/StepOne";
import StepTwo from "./Components/StepTwo";
import StepThree from "./Components/StepThree";
import StepFour from "./Components/StepFour";
import StepFive from "./Components/StepFive";
import StepSix from "./Components/StepSix";
import StepSeven from "./Components/StepSeven";
import StepEight from "./Components/StepEight";

// Define steps
const steps = [
  "Personal Details",
  "Physical Details",
  "Coverage",
  "Lifestyle",
  "Medical History",
  "Nominees",
  "Additional Details",
  "Confirmation",
];

// Map step components
const StepComponents = [
  StepOne,
  StepTwo,
  StepThree,
  StepFour,
  StepFive,
  StepSix,
  StepSeven,
  StepEight,
];

// Validation schemas for each step - keeping your existing validation schemas
const validationSchemas = [
  // Step 1: Personal Details
  Yup.object({
    firstName: Yup.string()
      .matches(/^[A-Za-z]+$/, "Only alphabets are allowed")
      .required("First Name is Required"),
    middleName: Yup.string().matches(
      /^[A-Za-z]*$/,
      "Only alphabets are allowed"
    ),
    lastName: Yup.string()
      .matches(/^[A-Za-z]+$/, "Only alphabets are allowed")
      .required("Last Name is Required"),
    email: Yup.string().email("Invalid email").required("Email is Required"),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Must be exactly 10 digits")
      .required("Mobile Number is Required"),
    address: Yup.string().required("Address is Required"),
    occupation: Yup.string().required("Occupation is Required"),
    income: Yup.number()
      .typeError("Income must be a number")
      .required("Income is Required")
      .positive("Income must be positive"),
    dob: Yup.date()
      .required("Date of Birth is Required")
      .max(new Date(), "Future date not allowed"),
    gender: Yup.string()
      .required("Gender is Required")
      .oneOf(["Male", "Female", "Other"], "Invalid gender"),
  }),

  // Step 2: Physical Details
  Yup.object({
    heightCm: Yup.number()
      .required("Height (cm) is Required")
      .positive("Height must be positive"),
    heightFt: Yup.number()
      .required("Height (ft) is Required")
      .positive("Height must be positive"),
    heightInches: Yup.number()
      .required("Height (inches) is Required")
      .min(0, "Height inches cannot be negative")
      .max(11, "Height inches cannot exceed 11"),
    weight: Yup.number()
      .required("Weight is Required")
      .positive("Weight must be positive"),
    bmi: Yup.number().positive("BMI must be positive").nullable(),
  }),

  // Step 3: Coverage
  Yup.object({
    coverageAmount: Yup.number()
      .required("Coverage Amount is Required")
      .positive("Coverage Amount must be positive"),
    tenure: Yup.number()
      .required("Tenure is Required")
      .positive("Tenure must be positive"),
  }),

  // Step 4: Lifestyle
  Yup.object({
    lifestyle: Yup.object({
      smoking: Yup.object({
        freq: Yup.string().oneOf(["Daily", "Weekly", ""], "Invalid frequency"),
        quantity: Yup.number().when("freq", {
          is: (freq) => freq === "Daily" || freq === "Weekly",
          then: (schema) =>
            schema
              .required("Smoking quantity is required")
              .positive("Quantity must be a positive number"),
          otherwise: (schema) => schema.nullable(),
        }),
      }),
      drinking: Yup.object({
        freq: Yup.string().oneOf(["Daily", "Weekly", ""], "Invalid frequency"),
        quantity: Yup.number().when("freq", {
          is: (freq) => freq === "Daily" || freq === "Weekly",
          then: (schema) =>
            schema
              .required("Drinking quantity is required")
              .positive("Quantity must be a positive number"),
          otherwise: (schema) => schema.nullable(),
        }),
      }),
      panMasala: Yup.object({
        freq: Yup.string().oneOf(
          ["Daily", "Weekly", ""],
          "Pan Masala frequency is required"
        ),
        quantity: Yup.number().when("freq", {
          is: (freq) => freq === "Daily" || freq === "Weekly",
          then: (schema) =>
            schema
              .required("Pan Masala quantity is required")
              .positive("Quantity must be a positive number"),
          otherwise: (schema) => schema.nullable(),
        }),
      }),
      others: Yup.string().nullable(),
    }),
  }),

  // Step 5: Medical History
  Yup.object({
    medicalHistory: Yup.array()
      .of(Yup.string().trim().min(1, "Cannot be empty"))
      .min(1, "At least one medical history entry is required"),
  }),

  // Step 6: Nominees
  Yup.object({
    nominees: Yup.array()
      .of(
        Yup.object({
          name: Yup.string()
            .required("Name is required")
            .matches(/^[A-Za-z ]+$/, "Only alphabets and spaces are allowed"),
          relation: Yup.string()
            .required("Relation is required")
            .oneOf(
              ["Father", "Mother", "Sister", "Brother", "Other"],
              "Invalid relation"
            ),
          gender: Yup.string()
            .required("Gender is required")
            .oneOf(["Male", "Female", "Other"], "Invalid gender"),
          contribution: Yup.number()
            .required("Contribution is required")
            .positive("Must be positive")
            .max(100, "Contribution cannot exceed 100%"),
        })
      )
      .test(
        "total-contribution",
        "Total contribution must equal 100",
        (nominees) => {
          if (!Array.isArray(nominees)) return false;
          const total = nominees.reduce(
            (sum, nominee) => sum + Number(nominee.contribution || 0),
            0
          );
          return total === 100;
        }
      ),
  }),

  // Step 7: Additional Details
  Yup.object({
    additional: Yup.object({
      pan: Yup.string()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format")
        .nullable(),
      aadhar: Yup.string()
        .matches(/^\d{4}\s\d{4}\s\d{4}$/, "Invalid Aadhar format")
        .nullable(),
      gstNumber: Yup.string()
        .matches(
          /^[0-9]{2}[A-Z]{4}[0-9]{4}[A-Z][1Z]$/,
          "Invalid GST number format"
        )
        .nullable(),
    }),
  }),
];

// Policy Confirmation Component
const PolicyConfirmation = ({ formValues, onReset }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const policyDetails = `
Policy Details:
--------------------------------------------------
Name: ${formValues.firstName} ${formValues.lastName}
Email: ${formValues.email}
Mobile: ${formValues.mobile}
Coverage Amount: ₹${formValues.coverageAmount}
Tenure: ${formValues.tenure} years
--------------------------------------------------
`;

    const blob = new Blob([policyDetails], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "policy_details.pdf";
    link.click();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        p: { xs: 2, sm: 3 },
      }}
    >
      <CheckCircleOutlineIcon
        color="success"
        sx={{ fontSize: { xs: 60, sm: 100 }, mb: 2 }}
      />

      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" } }}
      >
        Policy Created Successfully!
      </Typography>

      <Card
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 500,
          mt: 3,
          mb: 3,
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Policy Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Name:</strong> {formValues.firstName}{" "}
                {formValues.lastName}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Email:</strong> {formValues.email}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Coverage Amount:</strong> ₹{formValues.coverageAmount}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Tenure:</strong> {formValues.tenure} years
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: isMobile ? "center" : "space-between",
            alignItems: "center",
            p: 2,
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            startIcon={<LocalPrintshopOutlinedIcon />}
            onClick={handlePrint}
            fullWidth={isMobile}
          >
            Print Policy
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={handleDownload}
            fullWidth={isMobile}
          >
            Download Details
          </Button>
        </CardActions>
      </Card>

      <Button
        variant="outlined"
        color="primary"
        onClick={onReset}
        startIcon={<ReplayIcon />}
        sx={{ mt: 2 }}
      >
        Create Another Policy
      </Button>
    </Box>
  );
};

const CreatePolicyForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({});
  const [submittedFormValues, setSubmittedFormValues] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const CurrentStep = StepComponents[activeStep];
  const isLastStep = activeStep === StepComponents.length - 1;

  const handleNext = () => {
    setCompletedSteps((prev) => ({
      ...prev,
      [activeStep]: true,
    }));
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompletedSteps({});
    setSubmittedFormValues(null);
  };

  // Mobile stepper component for small screens
  const renderMobileStepper = () => (
    <Box sx={{ display: { xs: "block", sm: "none" }, px: 2 }}>
      <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 2 }}>
        {steps.map((label, index) => (
          <Step key={label} completed={completedSteps[index] === true}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );

  // Desktop/tablet stepper component
  const renderDesktopStepper = () => (
    <Stepper
      activeStep={activeStep}
      alternativeLabel={!isTablet}
      orientation={isTablet ? "vertical" : "horizontal"}
      sx={{ mb: 3, display: { xs: "none", sm: "flex" } }}
    >
      {steps.map((label, index) => (
        <Step key={label} completed={completedSteps[index] === true}>
          <StepLabel>{label}</StepLabel>
          {isTablet && (
            <StepContent>
              <Typography variant="body2" color="text.secondary">
                {`Step ${index + 1} of ${steps.length}: ${label}`}
              </Typography>
            </StepContent>
          )}
        </Step>
      ))}
    </Stepper>
  );

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: { xs: "100vh" },
        display: "flex",
        flexDirection: "column",
        py: { xs: 1, sm: 2, md: 4 },
        px: { xs: 1, sm: 2 },
      }}
    >
      {/* Current Step Indicator for Mobile */}
      {isMobile && (
        <Typography variant="h6" align="center" sx={{ my: 1, fontWeight: 500 }}>
          {steps[activeStep]} ({activeStep + 1}/{steps.length})
        </Typography>
      )}

      <Paper
        elevation={3}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          p: { xs: 1.5, sm: 2, md: 3 },
          borderRadius: { xs: 1, sm: 2 },
        }}
      >
        {/* Stepper - Different display based on screen size */}
        {isMobile ? renderMobileStepper() : renderDesktopStepper()}

        {submittedFormValues ? (
          <PolicyConfirmation
            formValues={submittedFormValues}
            onReset={handleReset}
          />
        ) : activeStep === steps.length ? (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: { xs: 2, sm: 3 },
            }}
          >
            <Typography variant="h5" align="center" sx={{ mb: 2 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleReset}
              startIcon={<ReplayIcon />}
            >
              Reset
            </Button>
          </Box>
        ) : (
          <Formik
            initialValues={{
              // Personal Details
              title: "",
              firstName: "",
              middleName: "",
              lastName: "",
              email: "",
              mobile: "",
              address: "",
              occupation: "",
              dob: "",
              income: "",
              gender: "",

              // Physical Details
              heightCm: "",
              heightFt: "",
              heightInches: "",
              weight: "",
              bmi: "",

              // Coverage Details
              coverageAmount: "",
              tenure: "",
              premium: "",

              // Lifestyle Details
              lifestyle: {
                smoking: { freq: "", quantity: "" },
                drinking: { freq: "", quantity: "" },
                panMasala: { freq: "", quantity: "" },
                others: "",
              },

              // Medical History
              medicalHistory: [""],

              // Nominees
              nominees: [
                {
                  name: "",
                  relation: "",
                  gender: "",
                  contribution: "",
                },
              ],

              // Additional Details
              additional: {
                pan: "",
                aadhar: "",
                gstNumber: "",
              },
            }}
            validationSchema={validationSchemas[activeStep]}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);
              if (!isLastStep) {
                handleNext();
                actions.setTouched({});
                actions.setSubmitting(false);
                return;
              }

              try {
                // Send POST request to backend
                const { data } = await axios.post(
                  "http://localhost:4000/api/policy/CreatePolicies",
                  values,
                  {
                    withCredentials: true,
                  }
                );
                console.log("API response", data);
                setSubmittedFormValues(values);
                handleNext();
              } catch (error) {
                console.error("Policy creation failed", error);
              } finally {
                actions.setSubmitting(false);
              }
            }}
          >
            {({
              isSubmitting,
              errors,
              touched,
              submitForm,
              isValid,
              dirty,
            }) => (
              <Form
                style={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                    overflow: "auto",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    p: { xs: 1, sm: 2 },
                  }}
                >
                  <CurrentStep
                    errors={errors}
                    touched={touched}
                    sx={{
                      flexGrow: 1,
                      width: "100%",
                    }}
                  />
                </Box>

                {/* Progress indicator for mobile */}
                {isMobile && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 1,
                      mb: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Step {activeStep + 1} of {steps.length}
                    </Typography>
                  </Box>
                )}

                <Stack
                  direction={isMobile ? "column" : "row"}
                  spacing={2}
                  sx={{
                    display: "flex",
                    justifyContent: isMobile ? "center" : "space-between",
                    mt: 3,
                    pt: 2,
                    borderTop: "1px solid rgba(0,0,0,0.12)",
                  }}
                >
                  {isMobile ? (
                    // Mobile layout - stacked buttons
                    <>
                      <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        onClick={submitForm}
                        disabled={isSubmitting || (dirty && !isValid)}
                        endIcon={
                          isLastStep ? <CheckIcon /> : <NavigateNextIcon />
                        }
                      >
                        {isLastStep ? "Finish" : "Next"}
                      </Button>

                      {activeStep > 0 && (
                        <Button
                          color="primary"
                          variant="outlined"
                          fullWidth
                          onClick={handleBack}
                          startIcon={<NavigateBeforeIcon />}
                        >
                          Back
                        </Button>
                      )}
                    </>
                  ) : (
                    // Desktop/Tablet layout - horizontal buttons
                    <>
                      <Tooltip title="Previous Step">
                        <span>
                          <Button
                            color="primary"
                            variant="outlined"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            startIcon={<NavigateBeforeIcon />}
                          >
                            Back
                          </Button>
                        </span>
                      </Tooltip>

                      <Tooltip title={isLastStep ? "Submit Form" : "Next Step"}>
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={submitForm}
                          disabled={isSubmitting || (dirty && !isValid)}
                          endIcon={
                            isLastStep ? <CheckIcon /> : <NavigateNextIcon />
                          }
                        >
                          {isLastStep ? "Finish" : "Next"}
                        </Button>
                      </Tooltip>
                    </>
                  )}
                </Stack>
              </Form>
            )}
          </Formik>
        )}
      </Paper>
    </Container>
  );
};

export default CreatePolicyForm;
