import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Alert,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  useTheme,
  alpha,
  Fade,
  IconButton,
  Divider,
  Container,
  LinearProgress,
  StepConnector,
  styled,
  Avatar,
} from "@mui/material";
import {
  CreateTwoTone as CreateIcon,
  VerifiedUserTwoTone as VerifyIcon,
  CheckCircleTwoTone as SuccessIcon,
  ArrowBackIos as BackIcon,
  MailOutline as MailIcon,
  Support as SupportIcon,
  AccessTime as TimeIcon,
  Celebration as CelebrationIcon,
} from "@mui/icons-material";
import UpdateForm from "./RaiseTicketComponents/UpdateForm";
import { raiseTicketWithUpdates } from "./RaiseTicketComponents/ticketService";

// Custom styled components
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.MuiStepConnector-alternativeLabel`]: {
    top: 22,
  },
  [`&.MuiStepConnector-active`]: {
    [`& .MuiStepConnector-line`]: {
      backgroundImage: `linear-gradient(95deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.secondary.main} 100%)`,
    },
  },
  [`&.MuiStepConnector-completed`]: {
    [`& .MuiStepConnector-line`]: {
      backgroundImage: `linear-gradient(95deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.secondary.main} 100%)`,
    },
  },
  [`& .MuiStepConnector-line`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage: `linear-gradient(136deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.dark} 100%)`,
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage: `linear-gradient(136deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 50%, ${theme.palette.success.dark} 100%)`,
  }),
}));

// Custom step icon component
function ColorlibStepIcon(props) {
  const { active, completed, className, icon } = props;
  const icons = {
    1: <CreateIcon />,
    2: <VerifyIcon />,
    3: <SuccessIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
}

// The OTP input component
const OtpInput = ({ value, onChange, disabled, error }) => {
  const theme = useTheme();
  const length = 6; // Length of OTP
  const [values, setValues] = useState(Array(length).fill(""));

  // Update parent state when internal state changes
  const updateOtp = (newValues) => {
    const newOtp = newValues.join("");
    onChange(newOtp);
    return newOtp;
  };

  // Handle input change
  const handleChange = (index, e) => {
    const val = e.target.value;
    if (val === "" || /^\d$/.test(val)) {
      const newValues = [...values];
      newValues[index] = val;
      setValues(newValues);
      updateOtp(newValues);

      // Auto focus next input if current is filled
      if (val !== "" && index < length - 1) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  // Handle key down events
  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (values[index] === "" && index > 0) {
        const newValues = [...values];
        newValues[index - 1] = "";
        setValues(newValues);
        updateOtp(newValues);

        // Focus previous input
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        if (prevInput) prevInput.focus();
      }
    }
    // Handle left arrow
    else if (e.key === "ArrowLeft" && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
    // Handle right arrow
    else if (e.key === "ArrowRight" && index < length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const pasteDigits = paste.replace(/\D/g, "").slice(0, length);

    if (pasteDigits) {
      const newValues = Array(length).fill("");
      [...pasteDigits].forEach((digit, i) => {
        if (i < length) newValues[i] = digit;
      });
      setValues(newValues);
      updateOtp(newValues);

      // Focus last input with value
      const lastIndex = Math.min(pasteDigits.length - 1, length - 1);
      if (lastIndex >= 0) {
        const lastInput = document.getElementById(`otp-input-${lastIndex}`);
        if (lastInput) lastInput.focus();
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 1,
        width: "100%",
        my: 3,
      }}
    >
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <TextField
            key={index}
            id={`otp-input-${index}`}
            value={values[index]}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: "center",
                fontSize: "1.5rem",
                fontWeight: "bold",
                padding: "12px 0",
              },
            }}
            disabled={disabled}
            error={Boolean(error) && value.length <= index}
            variant="outlined"
            sx={{
              width: { xs: "40px", sm: "48px" },
              height: { xs: "50px", sm: "60px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                transition: "transform 0.2s",
                "&:focus-within": {
                  transform: "scale(1.05)",
                  zIndex: 1,
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`,
                },
              },
            }}
          />
        ))}
    </Box>
  );
};

// Main component
const RaiseTicketForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const theme = useTheme();

  // Form state
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Submit Changes", "Verify Identity", "Confirmation"];

  // OTP verification states
  const [pendingTicketId, setPendingTicketId] = useState(null);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countDown, setCountDown] = useState(0);

  // This function is called when update form is submitted
  const handleSubmit = async (updates) => {
    setLoading(true);
    setError("");

    try {
      console.log("Submitting updates:", updates);

      // Format the data properly for the API
      const requestPayload = {
        updates: updates,
      };

      const result = await raiseTicketWithUpdates(requestPayload);
      console.log("Response from server:", result);

      // Check if we need OTP verification
      if (result.pendingTicketId) {
        setPendingTicketId(result.pendingTicketId);
        setActiveStep(1); // Move to OTP verification step
      } else if (result.ticket && result.ticket._id) {
        // Direct success (unlikely with OTP flow but keeping as fallback)
        setTicketId(result.ticket._id);
        setActiveStep(2); // Move to success step
        setSuccess(true);
        triggerCelebration();
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    if (!otp || !pendingTicketId) return;

    setVerifying(true);
    setError("");

    try {
      const response = await fetch("http://localhost:4000/api/Ticket/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pendingTicketId,
          otp,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }

      // Success - ticket created
      setSuccess(true);
      if (data.ticket && data.ticket._id) {
        setTicketId(data.ticket._id);
      }

      // Move to success step
      setActiveStep(2);
      triggerCelebration();
    } catch (error) {
      console.error("OTP verification error:", error);
      setError(error.message || "Failed to verify OTP");
    } finally {
      setVerifying(false);
    }
  };

  // Handle resending OTP
  const handleResendOtp = async () => {
    if (resendDisabled || !pendingTicketId) return;

    setResendDisabled(true);
    let timeLeft = 60;
    setCountDown(timeLeft);

    // Start countdown timer
    const timer = setInterval(() => {
      timeLeft -= 1;
      setCountDown(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timer);
        setResendDisabled(false);
      }
    }, 1000);

    try {
      const response = await fetch(
        "http://localhost:4000/api/Ticket/resendOtp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pendingTicketId,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend OTP");
      }

      // Show success message
      setError("");
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError(error.message || "Failed to resend OTP");
    }
  };

  // Celebration animation without using the confetti library
  const triggerCelebration = () => {
    // Create a simple celebration effect using DOM elements
    const celebrationContainer = document.createElement("div");
    celebrationContainer.style.position = "fixed";
    celebrationContainer.style.top = "0";
    celebrationContainer.style.left = "0";
    celebrationContainer.style.width = "100%";
    celebrationContainer.style.height = "100%";
    celebrationContainer.style.pointerEvents = "none";
    celebrationContainer.style.zIndex = "9999";
    document.body.appendChild(celebrationContainer);

    // Create particles
    const colors = ["#FFC700", "#FF0055", "#2F6BFF", "#00C49A", "#FB5607"];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        const particle = document.createElement("div");
        particle.style.position = "absolute";
        particle.style.width = `${Math.random() * 10 + 5}px`;
        particle.style.height = particle.style.width;
        particle.style.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = "50%";
        particle.style.top = "60%";
        particle.style.left = `${Math.random() * 100}%`;

        celebrationContainer.appendChild(particle);

        // Animate
        const angle = Math.random() * Math.PI * 2;
        const velocity = 3 + Math.random() * 5;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 10; // Initial upward velocity

        let x = parseFloat(particle.style.left);
        let y = 60;
        let opacity = 1;

        const animate = () => {
          x += vx * 0.1;
          y -= vy * 0.1;
          vy += 0.2; // Gravity
          opacity -= 0.01;

          if (opacity <= 0) {
            particle.remove();
            return;
          }

          particle.style.transform = `translate(${vx}px, ${-y}%)`;
          particle.style.opacity = opacity;

          requestAnimationFrame(animate);
        };

        animate();
      }, Math.random() * 500);
    }

    // Clean up
    setTimeout(() => {
      celebrationContainer.remove();
    }, 3000);
  };

  // Go back to previous step
  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(0, prevStep - 1));
    setError("");
  };

  // Render form content based on active step
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Fade in={activeStep === 0}>
            <Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Please specify what information you'd like to update in your
                policy. Our team will review your request and process it
                accordingly.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }} variant="filled">
                  {error}
                </Alert>
              )}

              <UpdateForm onSubmit={handleSubmit} loading={loading} />
            </Box>
          </Fade>
        );

      case 1:
        return (
          <Fade in={activeStep === 1}>
            <Box>
              <Card
                elevation={3}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.primary.light, 0.05),
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                }}
              >
                <CardContent
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <Avatar
                    sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                  >
                    <MailIcon color="primary" />
                  </Avatar>
                  <Box>
                    <Typography variant="body1">
                      We've sent a verification code to your email address.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Please check your inbox and enter the code below.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }} variant="filled">
                  {error}
                </Alert>
              )}

              <OtpInput
                value={otp}
                onChange={setOtp}
                disabled={verifying}
                error={error}
              />

              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Button
                  variant="text"
                  color="primary"
                  disabled={resendDisabled}
                  onClick={handleResendOtp}
                  startIcon={resendDisabled && <TimeIcon />}
                  size="small"
                >
                  {resendDisabled
                    ? `Resend code in ${countDown}s`
                    : "Didn't receive code? Resend"}
                </Button>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
              >
                <Button
                  startIcon={<BackIcon />}
                  onClick={handleBack}
                  disabled={verifying}
                >
                  Back
                </Button>

                <Button
                  variant="contained"
                  onClick={handleVerifyOtp}
                  disabled={verifying || otp.length !== 6}
                  endIcon={
                    verifying ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                  sx={{
                    minWidth: 150,
                    borderRadius: 2,
                  }}
                >
                  {verifying ? "Verifying..." : "Verify"}
                </Button>
              </Box>
            </Box>
          </Fade>
        );

      case 2:
        return (
          <Fade in={activeStep === 2}>
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px auto",
                  animation: "pulse 1.5s infinite",
                }}
              >
                <SuccessIcon
                  sx={{
                    fontSize: 50,
                    color: theme.palette.success.main,
                  }}
                />
              </Box>

              <style jsx>{`
                @keyframes pulse {
                  0% {
                    transform: scale(1);
                  }
                  50% {
                    transform: scale(1.05);
                  }
                  100% {
                    transform: scale(1);
                  }
                }
              `}</style>

              <Typography variant="h5" gutterBottom fontWeight="bold">
                Update Request Submitted!
              </Typography>

              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                Your update request has been successfully submitted. Our team
                will review your changes and get back to you soon.
              </Typography>

              <Card
                variant="outlined"
                sx={{
                  mb: 4,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.info.light, 0.05),
                  display: "inline-block",
                  minWidth: "70%",
                }}
              >
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Ticket Reference ID
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="medium">
                    {ticketId || "TKT-PENDING"}
                  </Typography>
                </CardContent>
              </Card>

              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<SupportIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Contact Support
                </Button>

                <Button
                  variant="contained"
                  sx={{ borderRadius: 2 }}
                  onClick={() => (window.location.href = "/ConsumerDashBoard")}
                >
                  Return to Dashboard
                </Button>
              </Box>
            </Box>
          </Fade>
        );

      default:
        return null;
    }
  };

  // Main render
  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 150,
            height: 150,
            borderBottomLeftRadius: "100%",
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)}, ${alpha(theme.palette.primary.main, 0.05)})`,
            zIndex: 0,
            display: { xs: "none", md: "block" },
          }}
        />

        {/* Header */}
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h4"
            gutterBottom
            fontWeight="bold"
            color="primary"
          >
            Request Policy Update
          </Typography>
          <Divider sx={{ mb: 4 }} />
        </Box>

        {/* Stepper */}
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<ColorlibConnector />}
          sx={{ mb: 4, position: "relative", zIndex: 1 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step content */}
        <Box sx={{ position: "relative", zIndex: 1 }}>
          {loading && activeStep === 0 && <LinearProgress sx={{ mb: 2 }} />}

          {renderStepContent()}
        </Box>
      </Paper>
    </Container>
  );
};

export default RaiseTicketForm;
