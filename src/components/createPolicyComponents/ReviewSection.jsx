// src/createPolicyComponents/ReviewSection.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
} from "@mui/material";

export default function ReviewSection({ open, onClose, onConfirm, formData }) {
  const { coverageAmount, tenure, medicalHistory, lifestyle, premium } =
    formData;

  const baseCoverage = Number(coverageAmount) || 0;
  const tenureDiscount = tenure === 3 ? 10 : tenure === 2 ? 5 : 0;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Review Policy Details</DialogTitle>
      <DialogContent>
        <Paper sx={{ p: 2 }}>
          <Box mb={2}>
            <Typography variant="h6">
              Coverage Amount: ₹{baseCoverage}
            </Typography>
            <Typography variant="body1">Tenure: {tenure} Years</Typography>
            <Typography variant="body1">
              Discount: {tenureDiscount}% off
            </Typography>
            <Typography variant="h6">Total Premium: ₹{premium}</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
        <Button onClick={onConfirm} variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
