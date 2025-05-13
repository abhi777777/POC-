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
  Paper,
  TableContainer,
  Pagination,
  Divider,
  useMediaQuery,
  useTheme,
  TextField,
  InputAdornment,
  MenuItem,
  Button,
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useNavigate } from "react-router-dom";

const POLICIES_PER_PAGE = 10;

function PoliciesList() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tenureFilter, setTenureFilter] = useState("");
  const [page, setPage] = useState(1);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

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

  const handleExportCSV = () => {
    const headers = ["Full Name", "Tenure", "Premium", "Email", "Mobile"];
    const rows = policies.map((p) => [
      `${p.firstName} ${p.lastName}`,
      p.tenure,
      p.premium,
      p.email,
      p.mobile,
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "policies.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPolicies = policies.filter((p) => {
    const nameMatch = `${p.firstName} ${p.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const tenureMatch = tenureFilter
      ? p.tenure === parseInt(tenureFilter)
      : true;
    return nameMatch && tenureMatch;
  });

  const startIndex = (page - 1) * POLICIES_PER_PAGE;
  const selectedPolicies = filteredPolicies.slice(
    startIndex,
    startIndex + POLICIES_PER_PAGE
  );
  const totalPages = Math.ceil(filteredPolicies.length / POLICIES_PER_PAGE);

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

      <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          label="Filter by Tenure"
          size="small"
          value={tenureFilter}
          onChange={(e) => setTenureFilter(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All</MenuItem>
          {[1, 2, 3].map((year) => (
            <MenuItem key={year} value={year}>
              {year} years
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="outlined"
          size="small"
          startIcon={<FileDownloadIcon />}
          onClick={handleExportCSV}
        >
          Export CSV
        </Button>
      </Box>

      {loading ? (
        <Box>
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={40}
              sx={{ mb: 1, borderRadius: 1 }}
            />
          ))}
        </Box>
      ) : filteredPolicies.length === 0 ? (
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
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            onClick={() => navigate("/policies/explore")}
          >
            Explore Policies
          </Button>
        </Box>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table stickyHeader size="small" sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Full Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tenure</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Premium</TableCell>
                  {!isMobile && (
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  )}
                  <TableCell sx={{ fontWeight: 600 }}>Mobile</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedPolicies.map((p, index) => (
                  <TableRow
                    key={p._id}
                    hover
                    sx={{
                      backgroundColor:
                        index % 2 === 0 ? "background.paper" : "#f9f9f9",
                      "&:hover": {
                        backgroundColor: "#e3f2fd",
                        transition: "0.2s ease-in-out",
                      },
                    }}
                  >
                    <TableCell>{`${p.firstName} ${p.lastName}`}</TableCell>
                    <TableCell>
                      {p.tenure ? `${p.tenure} years` : "—"}
                    </TableCell>
                    <TableCell>
                      {typeof p.premium === "number"
                        ? `₹${p.premium.toLocaleString()}`
                        : "—"}
                    </TableCell>
                    {!isMobile && <TableCell>{p.email}</TableCell>}
                    <TableCell>{p.mobile}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider />

          <Box
            p={2}
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            bgcolor="#fafafa"
            gap={1}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {startIndex + 1}–{" "}
              {Math.min(
                startIndex + POLICIES_PER_PAGE,
                filteredPolicies.length
              )}{" "}
              of {filteredPolicies.length} policies
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
