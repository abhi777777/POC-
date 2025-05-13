import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  Tabs,
  Tab,
  Fade,
  Slide,
  IconButton,
  Drawer,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  useMediaQuery,
  BottomNavigation,
  BottomNavigationAction,
  Skeleton,
  Badge,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  ShoppingCart,
  Description,
  SupportAgent,
  AccountCircle,
  Logout,
} from "@mui/icons-material";
import BuyPolicy from "../../components/BuyPolicy";
import PurchasedPolicies from "../../components/PurchasedPolicies";
import RaiseTicketForm from "../../components/RaiseTicketForm";
import { useNavigate } from "react-router-dom";

// Ensure your root App is wrapped in <ThemeProvider theme={yourTheme}>...
export default function ConsumerDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [tabIndex, setTabIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/users/profile",
          {
            withCredentials: true,
          }
        );
        setUserInfo(data);
        setError(null);
      } catch (err) {
        console.error("Profile load error", err);
        setError(err.response?.data?.error || "Could not load profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/users/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.response || err);
    }
  };

  const sections = [
    { label: "Buy Policy", icon: <ShoppingCart />, component: <BuyPolicy /> },
    {
      label: "My Policies",
      icon: (
        <Badge badgeContent={userInfo?.policies?.length || 0} color="secondary">
          <Description />
        </Badge>
      ),
      component: <PurchasedPolicies />,
    },
    {
      label: "Support",
      icon: <SupportAgent />,
      component: <RaiseTicketForm />,
    },
  ];

  return (
    <Box sx={{ p: 2, minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Welcome Banner */}
      <Card
        sx={{
          mb: 3,
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          alignItems: "center",
          bgcolor: "primary.light",
          color: "primary.contrastText",
        }}
      >
        {loading ? (
          <Skeleton variant="circular" width={60} height={60} />
        ) : (
          <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
            {userInfo?.name?.charAt(0)?.toUpperCase() || <AccountCircle />}
          </Avatar>
        )}
        <Box>
          <Typography variant="h5">
            {loading ? (
              <Skeleton width="50%" />
            ) : (
              `Hello, ${userInfo?.name?.split(" ")[0] || "User"}!`
            )}
          </Typography>
          <Typography variant="body2">
            {loading ? (
              <Skeleton width="30%" />
            ) : (
              `Welcome back to your dashboard.`
            )}
          </Typography>
        </Box>
      </Card>

      {/* Main Content Card */}
      <Card
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "background.paper",
        }}
      >
        {!isMobile && (
          <Tabs
            value={tabIndex}
            onChange={(e, v) => setTabIndex(v)}
            variant="standard"
            indicatorColor="primary"
            textColor="inherit"
            sx={{
              borderBottom: "none",
              borderColor: "divider",
              minHeight: "auto",
              ".MuiTab-root": {
                minHeight: "auto",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.95rem",
                px: 2,
                color: "#555",
                "&.Mui-selected": {
                  color: "#000",
                },
              },
              ".MuiTabs-indicator": {
                height: 3,
                borderRadius: 2,
              },
            }}
          >
            {sections.map((sec) => (
              <Tab key={sec.label} icon={sec.icon} label={sec.label} />
            ))}
          </Tabs>
        )}

        <Slide in mountOnEnter unmountOnExit direction="up">
          <Box sx={{ mt: 2, minHeight: 300 }}>
            <Fade in timeout={500}>
              <Box>{sections[tabIndex].component}</Box>
            </Fade>
          </Box>
        </Slide>
      </Card>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <BottomNavigation
          value={tabIndex}
          onChange={(e, v) => setTabIndex(v)}
          showLabels
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0, boxShadow: 3 }}
        >
          {sections.map((sec) => (
            <BottomNavigationAction
              key={sec.label}
              label={sec.label}
              icon={sec.icon}
            />
          ))}
        </BottomNavigation>
      )}

      {/* Profile Drawer */}
      <IconButton
        onClick={() => setSidebarOpen(true)}
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          bgcolor: "background.paper",
          boxShadow: 2,
        }}
      >
        <AccountCircle fontSize="large" />
      </IconButton>
      <Drawer
        anchor="right"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        PaperProps={{ sx: { width: isMobile ? "70%" : 300, p: 2 } }}
      >
        <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
          Profile
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {loading ? (
          <List>
            {[1, 2, 3].map((i) => (
              <ListItem key={i}>
                <Skeleton width="80%" />
              </ListItem>
            ))}
          </List>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: "center" }}>
            {error}
          </Typography>
        ) : (
          <List>
            <ListItem>
              <ListItemText
                primary="Full Name"
                secondary={userInfo?.name || "N/A"}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Email"
                secondary={userInfo?.email || "N/A"}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Phone"
                secondary={userInfo?.phone || "N/A"}
              />
            </ListItem>
            {userInfo?.role && (
              <ListItem>
                <ListItemText primary="Role" secondary={userInfo.role} />
              </ListItem>
            )}
          </List>
        )}
        <Divider sx={{ my: 2 }} />
        <Button
          variant="contained"
          startIcon={<Logout />}
          onClick={handleLogout}
          fullWidth
          sx={{ mt: 1 }}
        >
          Logout
        </Button>
      </Drawer>
    </Box>
  );
}
