import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { Policy as PolicyIcon } from "@mui/icons-material";

export default function AvailablePolicies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/policy/getAvailablePolicies",
          {
            withCredentials: true,
          }
        );
        setPolicies(res.data.policies || []);
      } catch (err) {
        console.error(err);
        setSnackbar({
          open: true,
          message: "Failed to fetch policies",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  const handleBuyPolicy = async (policyId) => {
    setBuying(policyId);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/policy/buy",
        { policyId },
        { withCredentials: true }
      );
      setSnackbar({
        open: true,
        message: response.data.message || "Policy purchased successfully!",
        severity: "success",
      });
      // Optionally refetch policies
      setPolicies((prev) => prev.filter((p) => p._id !== policyId));
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Failed to buy policy",
        severity: "error",
      });
    } finally {
      setBuying(null);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, m: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        <PolicyIcon sx={{ verticalAlign: "middle", mr: 1 }} />
        Available Policies
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : policies.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
          <Typography variant="h6">No available policies found</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>
                  <strong>Title</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Mobile</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Action</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {policies.map((policy, index) => (
                <TableRow
                  key={policy._id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#fafafa" : "white",
                  }}
                >
                  <TableCell>{policy.policyTitle}</TableCell>
                  <TableCell>{policy.email}</TableCell>
                  <TableCell>{policy.mobile}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={buying === policy._id}
                      onClick={() => handleBuyPolicy(policy._id)}
                      sx={{ minWidth: 120 }}
                    >
                      {buying === policy._id ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Buy"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
