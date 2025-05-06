import React, { useState, useEffect } from "react";
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
  useMediaQuery,
} from "@mui/material";
import {
  ShoppingCart,
  Assignment,
  HelpOutline,
  AccountCircle,
} from "@mui/icons-material";
import BuyPolicy from "../../components/BuyPolicy";
import PurchasedPolicies from "../../components/PurchasedPolicies";
import RaiseTicketForm from "../../components/RaiseTicketForm";
import { useNavigate } from "react-router-dom";

export default function ConsumerDashboard() {
  const [value, setValue] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:4000/api/users/profile",
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch profile");
        }

        const data = await response.json();
        setUserInfo(data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/users/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.error("Logout failed:", errorData.error);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleProfileClick = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const renderSectionTitle = () => {
    switch (value) {
      case 0:
        return "Buy a New Policy";
      case 1:
        return "My Purchased Policies";
      case 2:
        return "Raise a Service Ticket";
      default:
        return "";
    }
  };

  const renderView = () => {
    switch (value) {
      case 0:
        return <BuyPolicy />;
      case 1:
        return <PurchasedPolicies />;
      case 2:
        return <RaiseTicketForm />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, minHeight: "100vh", position: "relative" }}>
      <Typography variant="h4" gutterBottom>
        Consumer Dashboard
      </Typography>

      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: "#fafafa",
        }}
      >
        <Typography variant="h5" gutterBottom>
          {renderSectionTitle()}
        </Typography>

        <Tabs
          value={value}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="dashboard tabs"
        >
          <Tab icon={<ShoppingCart />} label="Buy Policy" />
          <Tab icon={<Assignment />} label="My Policies" />
          <Tab icon={<HelpOutline />} label="Raise Ticket" />
        </Tabs>

        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <Box sx={{ mt: 2 }}>
            <Fade in timeout={400}>
              <Box>{renderView()}</Box>
            </Fade>
          </Box>
        </Slide>
      </Card>

      {/* Profile Button */}
      <IconButton
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          backgroundColor: "#fff",
          boxShadow: 2,
          "&:hover": { backgroundColor: "#f0f0f0" },
        }}
        onClick={handleProfileClick}
      >
        <AccountCircle fontSize="large" />
      </IconButton>

      {/* Profile Sidebar */}
      <Drawer
        anchor="right"
        open={isSidebarOpen}
        onClose={handleCloseSidebar}
        sx={{
          width: isMobile ? "60%" : 300,
          "& .MuiDrawer-paper": {
            width: isMobile ? "60%" : 300,
            padding: 2,
            backgroundColor: "#f4f4f9",
            borderRadius: 2,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            p: 2,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ textAlign: "center", mb: 3 }}
            >
              User Profile
            </Typography>

            {loading ? (
              <Typography sx={{ textAlign: "center" }}>
                Loading user info...
              </Typography>
            ) : error ? (
              <Typography color="error" sx={{ textAlign: "center" }}>
                {error}
              </Typography>
            ) : userInfo ? (
              <>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Full Name"
                      secondary={userInfo.name || "N/A"}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Email"
                      secondary={userInfo.email || "N/A"}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Phone"
                      secondary={userInfo.phone || "N/A"}
                    />
                  </ListItem>
                  {userInfo.role && (
                    <ListItem>
                      <ListItemText primary="Role" secondary={userInfo.role} />
                    </ListItem>
                  )}
                </List>
                <Divider sx={{ my: 2 }} />
              </>
            ) : (
              <Typography sx={{ textAlign: "center" }}>
                No user information available.
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{
              mt: 2,
              borderRadius: 5,
              backgroundColor: "#ff4444",
              "&:hover": {
                backgroundColor: "#ff1a1a",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
