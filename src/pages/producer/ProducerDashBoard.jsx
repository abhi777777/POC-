import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Fade,
  IconButton,
  useTheme,
} from "@mui/material";
import { ListAlt, AddCircle, AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

import PoliciesList from "../../components/PoliciesList";
import CreatePolicyForm from "../../components/CreatePolicyForm";
import StatisticsCards from "../../components/StatisticsCards";
import ProfileSidebar from "../../components/ProfileSidebar";

export default function ProducerDashboard() {
  const [value, setValue] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    totalPolicies: 0,
    policiesSold: 0,

    revenue: "₹0",
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        setStatsLoading(true);
        const response = await fetch(
          "http://localhost:4000/api/users/getStats",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch statistics");
        }

        const data = await response.json();
        setStats(data);
        setStatsError(null);
      } catch (error) {
        console.error("Failed to fetch stats", error);
        setStatsError("Could not load dashboard statistics.");
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStatsData();
  }, []);

  const theme = useTheme();
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
            credentials: "include",
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

  7;

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
        p: { xs: 2, md: 3 },
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        position: "relative",
      }}
    >
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Hello Producer
        </Typography>
      </Paper>

      {/* Stats Cards */}
      <StatisticsCards statsData={stats} />

      {/* Main Content */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Tabs
          value={value}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="producer dashboard tabs"
          sx={{
            backgroundColor: "#f5f5f5",
            borderBottom: "1px solid #e0e0e0",
            "& .MuiTab-root": {
              py: 2,
              fontWeight: 500,
            },
            "& .Mui-selected": {
              fontWeight: 700,
            },
            "& .MuiTabs-indicator": {
              height: 3,
            },
          }}
        >
          <Tab
            icon={<ListAlt />}
            label="My Policies"
            aria-label="My Policies"
            iconPosition="start"
          />
          <Tab
            icon={<AddCircle />}
            label="Create Policy"
            aria-label="Create Policy"
            iconPosition="start"
          />
        </Tabs>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Typography
            variant="h5"
            gutterBottom
            fontWeight={600}
            color="primary"
          >
            {renderSectionTitle()}
          </Typography>

          <Fade in timeout={400}>
            <Box>{renderView()}</Box>
          </Fade>
        </Box>
      </Paper>

      {/* Profile button */}
      <IconButton
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          backgroundColor: "#fff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
          width: 50,
          height: 50,
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
        aria-label="profile"
        onClick={handleProfileClick}
      >
        <AccountCircle fontSize="large" color="primary" />
      </IconButton>

      {/* Sidebar (Drawer) for profile */}
      <ProfileSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        userInfo={userInfo}
        loading={loading}
        error={error}
        onLogout={handleLogout}
        isMobile={isMobile}
      />
    </Box>
  );
}
