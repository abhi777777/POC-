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
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Chip,
} from "@mui/material";
import PolicyIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

const PAGE_SIZE = 6;

export default function PurchasedPolicies() {
  const [purchases, setPurchases] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [page, setPage] = useState(1);
  const colors = [
    "#e3f2fd",
    "#e8f5e9",
    "#fff8e1",
    "#f3e5f5",
    "#ffebee",
    "#e0f7fa",
  ];
  const bgColor = (i) => colors[i % colors.length];

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

  useEffect(() => {
    let result = [...purchases];

    if (search.trim()) {
      result = result.filter((p) =>
        p.policy?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortOption === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === "coverage") {
      result.sort(
        (a, b) => b.policy?.coverageAmount - a.policy?.coverageAmount
      );
    }

    setFiltered(result);
    setPage(1); // reset to page 1 on filter/sort
  }, [search, sortOption, purchases]);

  const handleCardClick = (policy) => {
    setSelectedPolicy(policy);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPolicy(null);
  };

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        My Purchased Policies
      </Typography>

      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <TextField
          placeholder="Search by name"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            label="Sort By"
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="coverage">Coverage Amount</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Box textAlign="center" mt={5}>
          <Typography variant="h6">No matching policies found.</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginated.map((p) => (
              <Grid item xs={12} sm={6} md={4} key={p._id}>
                <Card
                  elevation={3}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    backgroundColor: "#e3f2fd",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 8,
                    },
                    transition: "transform 0.3s, box-shadow 0.3s",
                  }}
                  onClick={() => handleCardClick(p)}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: "#ffbb00" }}>
                        <PolicyIcon />
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600}>Health Policy</Typography>
                        <Typography variant="body2" color="text.secondary">
                          ₹{p.policy?.coverageAmount} | {p.policy?.tenure} yrs
                        </Typography>
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
                    <Box mt={1}>
                      <Chip label="Active" color="success" size="small" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={Math.ceil(filtered.length / PAGE_SIZE)}
              page={page}
              onChange={(e, val) => setPage(val)}
              color="primary"
            />
          </Box>
        </>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
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
                {new Date(selectedPolicy.createdAt).toLocaleDateString("en-IN")}
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
              <Box mt={3} display="flex" justifyContent="flex-end">
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
