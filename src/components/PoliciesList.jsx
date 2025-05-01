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
  Pagination,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

const POLICIES_PER_PAGE = 10;

function PoliciesList() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * POLICIES_PER_PAGE;
  const selectedPolicies = policies.slice(
    startIndex,
    startIndex + POLICIES_PER_PAGE
  );
  const totalPages = Math.ceil(policies.length / POLICIES_PER_PAGE);

  return (
    <Box p={{ xs: 1, sm: 3 }}>
      <Typography
        variant="h6"
        fontWeight="bold"
        gutterBottom
        sx={{ fontSize: isMobile ? "1.1rem" : "1.5rem" }}
      >
        📄 My Policies
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress size={isMobile ? 24 : 40} />
        </Box>
      ) : policies.length === 0 ? (
        <Box
          textAlign="center"
          color="text.secondary"
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt={5}
        >
          <SentimentDissatisfiedIcon fontSize="large" sx={{ mb: 1 }} />
          <Typography
            variant="body2"
            sx={{ fontSize: isMobile ? "0.8rem" : "1rem" }}
          >
            No policies found.
          </Typography>
        </Box>
      ) : (
        <Paper elevation={2} sx={{ mt: 2, borderRadius: 2 }}>
          <Box sx={{ overflowX: "auto" }}>
            <TableContainer>
              <Table size="small" sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: isMobile ? "0.7rem" : "0.9rem",
                      }}
                    >
                      Policy Title
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: isMobile ? "0.7rem" : "0.9rem",
                      }}
                    >
                      Name
                    </TableCell>
                    {!isMobile && (
                      <TableCell sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                        Email
                      </TableCell>
                    )}
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: isMobile ? "0.7rem" : "0.9rem",
                      }}
                    >
                      Mobile
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedPolicies.map((p, index) => (
                    <TableRow
                      key={p._id}
                      component={Box}
                      display="table-row"
                      hover
                      sx={{
                        backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
                        borderBottom: "8px solid transparent",
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      <TableCell
                        sx={{
                          fontSize: isMobile ? "0.7rem" : "0.85rem",
                          py: 1,
                        }}
                      >
                        {p.policyTitle}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: isMobile ? "0.7rem" : "0.85rem",
                          py: 1,
                        }}
                      >
                        {`${p.firstName} ${p.lastName}`}
                      </TableCell>
                      {!isMobile && (
                        <TableCell sx={{ fontSize: "0.85rem", py: 1 }}>
                          {p.email}
                        </TableCell>
                      )}
                      <TableCell
                        sx={{
                          fontSize: isMobile ? "0.7rem" : "0.85rem",
                          py: 1,
                        }}
                      >
                        {p.mobile}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Divider />

          <Box
            p={1.5}
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            bgcolor="#f9f9f9"
            gap={1}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: isMobile ? "0.7rem" : "0.85rem" }}
            >
              Showing {startIndex + 1}–
              {Math.min(startIndex + POLICIES_PER_PAGE, policies.length)} of{" "}
              {policies.length} policies
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChangePage}
              color="primary"
              shape="rounded"
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export default PoliciesList;
