import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Paper,
  TableContainer,
} from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

function PoliciesList() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPolicies() {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/policy/Mypolicies",
          { withCredentials: true }
        );
        setPolicies(res.data.policies);
      } catch (err) {
        console.error("Error fetching policies:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPolicies();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        My Policies
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : policies.length === 0 ? (
        <Box
          textAlign="center"
          color="text.secondary"
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt={6}
        >
          <SentimentDissatisfiedIcon fontSize="large" sx={{ mb: 1 }} />
          <Typography variant="body1">No policies found.</Typography>
        </Box>
      ) : (
        <Paper
          elevation={3}
          sx={{ mt: 3, borderRadius: 2, overflow: "hidden" }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Policy Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Mobile</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {policies.map((p, index) => (
                  <TableRow
                    key={p._id}
                    hover
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#fafafa" : "white",
                      transition: "background 0.2s",
                    }}
                  >
                    <TableCell>{p.policyTitle}</TableCell>
                    <TableCell>{`${p.firstName} ${p.lastName}`}</TableCell>
                    <TableCell>{p.email}</TableCell>
                    <TableCell>{p.mobile}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box p={2} display="flex" justifyContent="flex-end" bgcolor="#f9f9f9">
            <Typography variant="body2" color="text.secondary">
              Total Policies: {policies.length}
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export default PoliciesList;
