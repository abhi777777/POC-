import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid,
  Paper,
} from "@mui/material";

const steps = ["Fill Details", "Verify OTP"];

export default function RaiseTicketForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    subject: "",
    description: "",
    newName: "",
    newAddress: "",
    newPhoneNumber: "",
  });
  const [step, setStep] = useState(0);
  const [pendingId, setPendingId] = useState(null);
  const [otp, setOtp] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const widgetRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Initialize and open Cloudinary unsigned widget
  const openUploadWidget = () => {
    if (!widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: "dhnd7arvq",
          uploadPreset: "ml_default",
          resourceType: "raw",
          multiple: false,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary error", error);
            return;
          }
          if (result.event === "success") {
            console.log("Upload success", result.info.secure_url);
            setPdfUrl(result.info.secure_url);
          }
        }
      );
    }
    widgetRef.current.open();
  };

  const requestTicket = async () => {
    if (!pdfUrl) {
      alert("Please upload your proof PDF first.");
      return;
    }

    try {
      const payload = {
        ...formData,
        newName: formData.newName || undefined,
        newAddress: formData.newAddress || undefined,
        newPhoneNumber: formData.newPhoneNumber || undefined,
        pdfUrl, // include the Cloudinary URL
      };
      const res = await axios.post(
        "http://localhost:4000/api/Ticket/raiseticket",
        payload,
        { withCredentials: true }
      );
      setPendingId(res.data.pendingTicketId);
      setStep(1);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error requesting ticket");
    }
  };

  const verifyOtp = async () => {
    try {
      const payload = {
        pendingTicketId: pendingId,
        email: formData.email,
        otp,
      };
      await axios.post("http://localhost:4000/api/Ticket/verify", payload, {
        withCredentials: true,
      });
      alert("Ticket raised successfully!");
      // reset everything
      setStep(0);
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        subject: "",
        description: "",
        newName: "",
        newAddress: "",
        newPhoneNumber: "",
      });
      setOtp("");
      setPdfUrl("");
      setPendingId(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "OTP verification failed");
    }
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={12} md={8} lg={6}>
        <Card elevation={3} sx={{ borderRadius: 2, p: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom align="center">
              Support Ticket
            </Typography>
            <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {step === 0 && (
              <Box component={Paper} sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  {/* Text inputs */}
                  {[
                    { label: "Name", name: "name", required: true },
                    { label: "Email", name: "email", required: true },
                    {
                      label: "Phone Number",
                      name: "phoneNumber",
                      required: true,
                      inputProps: { maxLength: 10 },
                    },
                    { label: "Subject", name: "subject", required: true },
                  ].map((field) => (
                    <Grid item xs={12} sm={6} key={field.name}>
                      <TextField
                        fullWidth
                        label={field.label}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        required={field.required}
                        inputProps={field.inputProps}
                      />
                    </Grid>
                  ))}

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  {/* Optional updates */}
                  <Grid item xs={12} container alignItems="center" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle1">
                        Optional Updates:
                      </Typography>
                    </Grid>
                    <Grid item xs>
                      <Grid container spacing={1}>
                        {[
                          { label: "New Name", name: "newName" },
                          { label: "New Address", name: "newAddress" },
                          {
                            label: "New Phone",
                            name: "newPhoneNumber",
                            inputProps: { maxLength: 10 },
                          },
                        ].map((opt) => (
                          <Grid item xs={12} sm={4} key={opt.name}>
                            <TextField
                              fullWidth
                              size="small"
                              label={opt.label}
                              name={opt.name}
                              value={formData[opt.name]}
                              onChange={handleChange}
                              inputProps={opt.inputProps}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* PDF upload */}
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={openUploadWidget}
                    >
                      {pdfUrl ? "Re-upload PDF" : "Upload Proof PDF"}
                    </Button>
                    {pdfUrl && (
                      <Typography variant="caption" display="block" mt={1}>
                        Uploaded file URL:{" "}
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {pdfUrl}
                        </a>
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={requestTicket}
                      disabled={
                        !formData.name ||
                        !formData.email ||
                        !formData.phoneNumber ||
                        !formData.subject ||
                        !formData.description ||
                        !pdfUrl
                      }
                    >
                      Request OTP & Raise Ticket
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}

            {step === 1 && (
              <Box component={Paper} sx={{ p: 2 }}>
                <TextField
                  fullWidth
                  label="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" fullWidth onClick={verifyOtp}>
                  Verify OTP & Submit
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
