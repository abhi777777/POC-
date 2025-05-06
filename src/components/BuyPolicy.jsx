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
  Box,
  Pagination,
} from "@mui/material";
import { Policy as PolicyIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Make sure to import the Toastify styles

export default function AvailablePolicies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

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
        toast.error("Failed to fetch policies");
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
      toast.success(response.data.message || "Policy purchased successfully!");
      // Optionally refetch policies
      setPolicies((prev) => prev.filter((p) => p._id !== policyId));
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to buy policy");
    } finally {
      setBuying(null);
    }
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const paginatedPolicies = policies.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

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
        <>
          <TableContainer component={Paper} elevation={1}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Coverage Amount</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Tenure</strong>
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
                {paginatedPolicies.map((policy, index) => (
                  <TableRow
                    key={policy._id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#fafafa" : "white",
                    }}
                  >
                    <TableCell>{policy.email}</TableCell>
                    <TableCell>{policy.coverageAmount}</TableCell>
                    <TableCell>{policy.tenure}</TableCell>
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
                          `Buy - ₹${policy.premium}`
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={Math.ceil(policies.length / pageSize)}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        </>
      )}
    </Paper>
  );
}
