import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
} from "@mui/material";
import PolicyIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";

export default function PurchasedPolicies() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch purchased policies
  useEffect(() => {
    async function fetchMy() {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/policy/purchases",
          {
            withCredentials: true,
          }
        );
        setPurchases(res.data.purchases);
      } catch (err) {
        console.error("Failed to fetch purchased policies", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMy();
  }, []);

  // Open policy detail dialog
  const handleCardClick = (policy) => {
    setSelectedPolicy(policy);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPolicy(null);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        My Purchased Policies
      </Typography>

      {/* Loading State */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : purchases.length === 0 ? (
        // Empty State
        <Box textAlign="center" mt={5}>
          <Typography variant="h6">No policies purchased yet.</Typography>
        </Box>
      ) : (
        // Policy Cards
        <Grid container spacing={3}>
          {purchases.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p._id}>
              <Card
                elevation={3}
                sx={{ borderRadius: 3, cursor: "pointer" }}
                onClick={() => handleCardClick(p)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: "#ffbb00" }}>
                      <PolicyIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Purchased on:{" "}
                        {new Date(p.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Policy Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Policy Details
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedPolicy ? (
            <>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Purchased on:{" "}
                {new Date(selectedPolicy.createdAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </Typography>

              <Box mt={2}>
                <Typography>
                  <strong>Coverage Amount:</strong> ₹
                  {selectedPolicy.policy?.coverageAmount || "N/A"}
                </Typography>
                <Typography>
                  <strong>Premium:</strong> ₹
                  {selectedPolicy.policy?.premium || "N/A"}
                </Typography>
                <Typography>
                  <strong>Term:</strong>{" "}
                  {selectedPolicy.policy?.tenure || "N/A"} years
                </Typography>
              </Box>

              <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
                {/* Optional: Add Download Button */}
                {/* <Button variant="outlined" onClick={handleDownloadPDF}>
                  Download PDF
                </Button> */}
                <Button
                  variant="contained"
                  onClick={handleCloseDialog}
                  sx={{ bgcolor: "#ffbb00", color: "#000" }}
                >
                  Close
                </Button>
              </Box>
            </>
          ) : (
            <Typography>No policy selected.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
