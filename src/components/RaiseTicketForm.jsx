// RaiseTicketForm.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Alert,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import UpdateForm from "./RaiseTicketComponents/UpdateForm";
import { raiseTicketWithUpdates } from "./RaiseTicketComponents/ticketService";

const RaiseTicketForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [ticketId, setTicketId] = useState(null);

  // OTP verification states
  const [pendingTicketId, setPendingTicketId] = useState(null);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [verifying, setVerifying] = useState(false);

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
        setShowOtpForm(true);
        setEmail(updates.email || ""); // Use provided email or default to empty for user to enter
      } else if (result.ticket && result.ticket._id) {
        // Direct success (unlikely with OTP flow but keeping as fallback)
        setSuccess(true);
        setTicketId(result.ticket._id);
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  };

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
          email,
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
    } catch (error) {
      console.error("OTP verification error:", error);
      setError(error.message || "Failed to verify OTP");
    } finally {
      setVerifying(false);
    }
  };

  if (success) {
    return (
      <Box>
        <Alert severity="success" sx={{ mb: 2 }}>
          Your update request has been submitted successfully!{" "}
          {ticketId && `Ticket ID: ${ticketId}`}
        </Alert>
        <Typography variant="body1">
          Our team will review your changes and get back to you soon.
        </Typography>
      </Box>
    );
  }

  if (showOtpForm) {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Verify Your Email
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          An OTP has been sent to your email. Please enter it below to complete
          your update request.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={verifying}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={verifying}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          onClick={handleVerifyOtp}
          disabled={verifying || !otp}
          startIcon={
            verifying && <CircularProgress size={20} color="inherit" />
          }
          fullWidth
        >
          {verifying ? "Verifying..." : "Verify OTP"}
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        What information would you like to update?
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <UpdateForm onSubmit={handleSubmit} loading={loading} />
    </Box>
  );
};

export default RaiseTicketForm;
