import React, { useEffect, useState } from "react";
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

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAvailablePolicies,
  buyPolicy,
} from "../Slices/availablePoliciesSlice";

export default function AvailablePolicies() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  // paging and UI state
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Redux state
  const {
    items: policies,
    isLoading: loading,
    error,
    buyingId,
  } = useSelector((state) => state.availablePolicies);

  // Fetch on mount
  useEffect(() => {
    dispatch(fetchAvailablePolicies());
  }, [dispatch]);

  const handleBuy = (id) => {
    dispatch(buyPolicy(id))
      .unwrap()
      .then(() => {
        toast.success("Policy purchased successfully!");
      })
      .catch((err) => {
        toast.error(err || "Failed to buy policy");
      });
  };

  const handleChangePage = (_, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const paginated = policies.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(policies.length / pageSize);
  const colors = [
    "#e3f2fd",
    "#e8f5e9",
    "#fff8e1",
    "#f3e5f5",
    "#ffebee",
    "#e0f7fa",
  ];
  const bgColor = (i) => colors[i % colors.length];

  return (
    <Box
      sx={{
        py: 4,
        px: { xs: 2, sm: 3 },
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
          {/* header circles */}
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
          <Stack direction="row" alignItems="center" spacing={2}>
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
            <LinearProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ mt: 4 }}>
            {error}
          </Typography>
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
              {paginated.map((policy, idx) => (
                <Grid item xs={12} sm={6} md={4} key={policy._id}>
                  <Zoom in style={{ transitionDelay: `${idx * 100}ms` }}>
                    <Card
                      elevation={3}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 2,
                        backgroundColor: bgColor(idx),
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: 8,
                        },
                        transition: "transform 0.3s, box-shadow 0.3s",
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="h5"
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
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="body2" noWrap>
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
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2">
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
                            <PaymentsIcon fontSize="small" color="action" />
                            <Typography variant="body2" fontWeight="medium">
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
                          disabled={buyingId === policy._id}
                          onClick={() => handleBuy(policy._id)}
                          sx={{ borderRadius: 8, py: 1 }}
                        >
                          {buyingId === policy._id ? (
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
                count={totalPages}
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
