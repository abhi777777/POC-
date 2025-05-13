import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  CircularProgress,
  Button,
  Pagination,
  Stack,
  Container,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
  LinearProgress,
  Zoom,
  alpha,
} from "@mui/material";
import {
  Policy as PolicyIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AccessTime as AccessTimeIcon,
  Payments as PaymentsIcon,
  MonetizationOn as MonetizationOnIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AvailablePolicies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  // Generate random pastel colors for cards
  const generateRandomColor = (index) => {
    const colors = [
      "#e3f2fd", // light blue
      "#e8f5e9", // light green
      "#fff8e1", // light amber
      "#f3e5f5", // light purple
      "#ffebee", // light red
      "#e0f7fa", // light cyan
    ];
    return colors[index % colors.length];
  };

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/policy/getAvailablePolicies",
          { withCredentials: true }
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
      const res = await axios.post(
        "http://localhost:4000/api/policy/buy",
        { policyId },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Policy purchased successfully!");
      setPolicies((prev) => prev.filter((p) => p._id !== policyId));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to buy policy");
    } finally {
      setBuying(null);
    }
  };

  const handleChangePage = (event, value) => {
    setPage(value);
    // Smooth scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const paginatedPolicies = policies.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <Box
      sx={{
        py: 4,
        px: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "#f9fafc",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="xl">
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "-30%",
              right: "-5%",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              backgroundColor: alpha("#fff", 0.1),
              display: { xs: "none", md: "block" },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "-20%",
              left: "10%",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              backgroundColor: alpha("#fff", 0.1),
              display: { xs: "none", md: "block" },
            }}
          />

          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            position="relative"
          >
            <PolicyIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Available Policies
              </Typography>
              <Typography variant="subtitle1">
                Browse and purchase insurance policies that match your needs
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {loading ? (
          <Box sx={{ width: "100%", mt: 4 }}>
            <Typography
              variant="h6"
              color="text.secondary"
              align="center"
              gutterBottom
            >
              Loading available policies...
            </Typography>
            <LinearProgress color="primary" />
          </Box>
        ) : policies.length === 0 ? (
          <Paper
            elevation={3}
            sx={{ p: 8, textAlign: "center", borderRadius: 2, mt: 4 }}
          >
            <PolicyIcon
              color="disabled"
              sx={{ fontSize: 60, mb: 2, opacity: 0.6 }}
            />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No Available Policies
            </Typography>
            <Typography variant="body1" color="text.secondary">
              There are currently no policies available for purchase.
            </Typography>
          </Paper>
        ) : (
          <>
            <Grid container spacing={3}>
              {paginatedPolicies.map((policy, index) => (
                <Grid item xs={12} sm={6} md={4} key={policy._id}>
                  <Zoom
                    in={true}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <Card
                      elevation={3}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 2,
                        backgroundColor: generateRandomColor(index),
                        transition:
                          "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: 8,
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="h5"
                            component="div"
                            fontWeight="bold"
                            color="primary"
                          >
                            ₹{policy.coverageAmount.toLocaleString()}
                          </Typography>
                          <Chip
                            icon={<AccessTimeIcon />}
                            label={`${policy.tenure} years`}
                            color="primary"
                            size="small"
                            variant="outlined"
                          />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Stack spacing={2}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <EmailIcon color="action" fontSize="small" />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                            >
                              {policy.email}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <PhoneIcon color="action" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              {policy.mobile}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <PaymentsIcon color="action" fontSize="small" />
                            <Typography
                              variant="body2"
                              color="text.primary"
                              fontWeight="medium"
                            >
                              Premium: <strong>₹{policy.premium}</strong>
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>

                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          size="large"
                          disabled={buying === policy._id}
                          onClick={() => handleBuyPolicy(policy._id)}
                          startIcon={
                            buying !== policy._id && <MonetizationOnIcon />
                          }
                          sx={{
                            borderRadius: 8,
                            boxShadow: 2,
                            py: 1,
                          }}
                        >
                          {buying === policy._id ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            `Buy Now - ₹${policy.premium}`
                          )}
                        </Button>
                      </CardActions>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>

            <Box mt={6} mb={3} display="flex" justifyContent="center">
              <Pagination
                count={Math.ceil(policies.length / pageSize)}
                page={page}
                onChange={handleChangePage}
                color="primary"
                size={isMobile ? "small" : "large"}
                variant="outlined"
                shape="rounded"
                showFirstButton
                showLastButton
              />
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}
