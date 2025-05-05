import React, { useMemo } from "react";
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
  // Extract values from original state keys
  const baseCoverage = Number(formData.coverageAmount) || 0;
  const tenure = Number(formData.tenure) || 0;
  const medicalCount = Array.isArray(formData.medicalHistory)
    ? formData.medicalHistory.filter((item) => item).length
    : 0;

  // Count lifestyle issues: smoking, drinking, panMasala, others
  const lifestyleObj = formData.lifestyle || {};
  const lifestyleCount = ["smoking", "drinking", "panMasala", "others"].reduce(
    (count, key) => {
      const entry = lifestyleObj[key];
      if (key === "others") {
        return count + (entry ? 1 : 0);
      }
      return count + (entry.freq || entry.quantity ? 1 : 0);
    },
    0
  );

  // Compute discount based on tenure
  const discountPercent = useMemo(() => {
    if (tenure === 3) return 10;
    if (tenure === 2) return 5;
    return 0;
  }, [tenure]);

  // Extra charges
  const extraMedical = medicalCount * 750;
  const extraLifestyle = lifestyleCount * 750;

  // Final premium calculation
  const premiumToPay = useMemo(() => {
    const discounted = baseCoverage * (1 - discountPercent / 100);
    return Math.round(discounted + extraMedical + extraLifestyle);
  }, [baseCoverage, discountPercent, extraMedical, extraLifestyle]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Premium Summary</DialogTitle>
      <Divider />
      <DialogContent dividers>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ mb: 1 }}>
            <Typography>
              Base Coverage: ₹{baseCoverage.toLocaleString()}
            </Typography>
            <Typography>Tenure Discount: {discountPercent}%</Typography>
            <Typography>
              Medical Issue Charges ({medicalCount}): ₹
              {extraMedical.toLocaleString()}
            </Typography>
            <Typography>
              Lifestyle Issue Charges ({lifestyleCount}): ₹
              {extraLifestyle.toLocaleString()}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" align="center">
            Total Premium to Pay: ₹{premiumToPay.toLocaleString()}
          </Typography>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={onConfirm} variant="contained">
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
}
