import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Fade,
  IconButton,
  Drawer,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { ListAlt, AddCircle, AccountCircle } from "@mui/icons-material";
import PoliciesList from "../../components/PoliciesList";
import CreatePolicyForm from "../../components/CreatePolicyForm";
import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import for redirection after logout

export default function ProducerDashboard() {
  const [value, setValue] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  // Fetch user profile data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:4000/api/users/profile",
          {
            method: "GET",
            credentials: "include", // Important for sending cookies
            headers: {
              "Content-Type": "application/json",
            },
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

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleProfileClick = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/users/logout", {
        method: "POST",
        credentials: "include", // Important for sending cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Redirect to login page after successful logout
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.error("Logout failed:", errorData.error);
        // You could add some UI feedback here if needed
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const renderSectionTitle = () => {
    switch (value) {
      case 0:
        return "My Policies";
      case 1:
        return "Create a New Policy";
      default:
        return "";
    }
  };

  const renderView = () => {
    switch (value) {
      case 0:
        return <PoliciesList />;
      case 1:
        return <CreatePolicyForm />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        background: "linear-gradient(to right, #ffecd2,rgb(80, 80, 80))",
        position: "relative",
      }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Producer Dashboard
        </Typography>

        <Typography variant="h5" gutterBottom>
          {renderSectionTitle()}
        </Typography>

        <Tabs
          value={value}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="producer dashboard tabs"
        >
          <Tab
            icon={<ListAlt />}
            label="My Policies"
            aria-label="My Policies"
          />
          <Tab
            icon={<AddCircle />}
            label="Create Policy"
            aria-label="Create Policy"
          />
        </Tabs>

        <Fade in timeout={400}>
          <Box sx={{ mt: 2 }}>{renderView()}</Box>
        </Fade>
      </Paper>

      {/* Profile button */}
      <IconButton
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          backgroundColor: "#fff",
          boxShadow: 2,
          "&:hover": {
            backgroundColor: "#f0f0f0",
          },
        }}
        aria-label="profile"
        onClick={handleProfileClick}
      >
        <AccountCircle fontSize="large" />
      </IconButton>

      {/* Sidebar (Drawer) for profile */}
      <Drawer
        anchor="right"
        open={isSidebarOpen}
        onClose={handleCloseSidebar}
        sx={{
          width: isMobile ? "60%" : 300,
          flexShrink: 0,
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
              gutterBottom
              fontWeight={600}
              sx={{ textAlign: "center", mb: 3 }}
            >
              User Profile
            </Typography>

            {/* User Info Display */}
            {loading ? (
              <Typography variant="body1" sx={{ textAlign: "center" }}>
                Loading user info...
              </Typography>
            ) : error ? (
              <Typography
                variant="body1"
                color="error"
                sx={{ textAlign: "center" }}
              >
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
                  {userInfo.address && (
                    <ListItem>
                      <ListItemText
                        primary="Address"
                        secondary={userInfo.address}
                      />
                    </ListItem>
                  )}
                </List>
                <Divider sx={{ my: 2 }} />
              </>
            ) : (
              <Typography variant="body1" sx={{ textAlign: "center" }}>
                No user information available.
              </Typography>
            )}
          </Box>

          {/* Logout Button */}
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout} // Updated to use the logout function
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
