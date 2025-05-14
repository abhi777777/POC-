import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Fade,
  IconButton,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  AppBar,
  Toolbar,
  Container,
  CircularProgress,
  Tooltip,
  Chip,
  alpha,
} from "@mui/material";
import {
  ShoppingCart,
  Description,
  SupportAgent,
  AccountCircle,
  Menu as MenuIcon,
  Person,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import BuyPolicy from "../../components/BuyPolicy";
import PurchasedPolicies from "../../components/PurchasedPolicies";
import RaiseTicketForm from "../../components/RaiseTicketForm";

import { fetchUserProfile, logout } from "../../Slices/userSlice";

// Improved theme with more refined visual aesthetics
const customTheme = createTheme({
  palette: {
    primary: {
      main: "#4361ee", // More modern blue
      light: "#738efd",
      dark: "#2c3ebb",
      contrastText: "#fff",
    },
    secondary: {
      main: "#7209b7", // Rich purple
      light: "#9d4eda",
      dark: "#560090",
      contrastText: "#fff",
    },
    background: {
      default: "#f8faff", // Softer background
      paper: "#ffffff",
    },
    success: {
      main: "#2ec4b6", // Teal
      light: "#59d2c8",
      dark: "#1a9e90",
    },
    info: {
      main: "#3a86ff",
      light: "#6ca7ff",
      dark: "#2567cc",
    },
    warning: {
      main: "#fb8500",
      light: "#ff9f33",
      dark: "#d67100",
    },
    error: {
      main: "#e63946",
      light: "#ed6671",
      dark: "#bf1f2d",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500 },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    "none",
    "0px 2px 6px rgba(0,0,0,0.04)",
    "0px 4px 12px rgba(0,0,0,0.04)",
    "0px 8px 16px rgba(0,0,0,0.04)",
    "0px 12px 24px rgba(0,0,0,0.05)",
    ...Array(20).fill("0px 12px 32px rgba(0,0,0,0.07)"),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 20px",
          boxShadow: "none",
        },
        containedPrimary: {
          background: "linear-gradient(45deg, #4361ee 30%, #738efd 90%)",
        },
        containedSecondary: {
          background: "linear-gradient(45deg, #7209b7 30%, #9d4eda 90%)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
        elevation1: {
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        },
        elevation2: {
          boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

const drawerWidth = 280;

export default function ConsumerDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(customTheme.breakpoints.down("sm"));

  const [tabIndex, setTabIndex] = useState(0);
  const [openDrawer, setOpenDrawer] = useState(!isMobile);

  // Redux selectors
  const { userInfo, profileLoading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (isMobile) {
      setOpenDrawer(false);
    } else {
      setOpenDrawer(true);
    }
  }, [isMobile]);

  const handleTabChange = (newValue) => {
    setTabIndex(newValue);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/users/logout",
        {},
        { withCredentials: true }
      );
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.response || err);
    }
  };

  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer);
  };

  const renderSectionTitle = () => {
    switch (tabIndex) {
      case 0:
        return "Buy Policy";
      case 1:
        return "My Policies";
      case 2:
        return "Support";
      default:
        return "";
    }
  };

  const renderView = () => {
    switch (tabIndex) {
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

  // Loading state
  if (profileLoading || !userInfo) {
    return (
      <ThemeProvider theme={customTheme}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            bgcolor: "background.default",
          }}
        >
          <CircularProgress color="primary" size={60} thickness={4} />
        </Box>
      </ThemeProvider>
    );
  }

  const drawer = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 4,
          background: "linear-gradient(135deg, #2c3ebb 0%, #4361ee 100%)",
          color: "primary.contrastText",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 100,
            height: 100,
            borderRadius: "50%",
            backgroundColor: alpha("#ffffff", 0.05),
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -20,
            left: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: alpha("#ffffff", 0.05),
          }}
        />

        <Avatar
          sx={{
            width: 84,
            height: 84,
            mb: 2,
            bgcolor: "secondary.main",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            border: "4px solid",
            borderColor: alpha("#ffffff", 0.2),
            fontSize: 32,
          }}
        >
          {userInfo?.name ? (
            userInfo.name.charAt(0).toUpperCase()
          ) : (
            <Person fontSize="large" />
          )}
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          {userInfo?.name || "Consumer"}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mb: 1.5 }}>
          {userInfo?.email || "consumer@example.com"}
        </Typography>

        <Chip
          icon={<AccountCircle sx={{ fontSize: 16 }} />}
          label="Consumer"
          size="small"
          sx={{
            bgcolor: alpha("#ffffff", 0.12),
            color: "white",
            fontWeight: 500,
            py: 0.5,
            "& .MuiChip-icon": { color: "white" },
          }}
        />
      </Box>

      <Box sx={{ mt: 3, px: 2 }}>
        <List>
          <ListItem
            button
            selected={tabIndex === 0}
            onClick={() => handleTabChange(0)}
            sx={{
              py: 1.5,
              mb: 1.5,
              borderRadius: 3,
              "&.Mui-selected": {
                backgroundColor: alpha(customTheme.palette.primary.main, 0.1),
                "&:hover": {
                  backgroundColor: alpha(
                    customTheme.palette.primary.main,
                    0.15
                  ),
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: "20%",
                  height: "60%",
                  width: 4,
                  backgroundColor: "primary.main",
                  borderRadius: "0 4px 4px 0",
                },
              },
              "&:hover": {
                backgroundColor: alpha(customTheme.palette.primary.main, 0.05),
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: tabIndex === 0 ? "primary.main" : "text.secondary",
                minWidth: 44,
              }}
            >
              <ShoppingCart />
            </ListItemIcon>
            <ListItemText
              primary="Buy Policy"
              primaryTypographyProps={{
                fontWeight: tabIndex === 0 ? 600 : 500,
                color: tabIndex === 0 ? "primary.main" : "text.primary",
              }}
            />
          </ListItem>
          <ListItem
            button
            selected={tabIndex === 1}
            onClick={() => handleTabChange(1)}
            sx={{
              py: 1.5,
              mb: 1.5,
              borderRadius: 3,
              "&.Mui-selected": {
                backgroundColor: alpha(customTheme.palette.primary.main, 0.1),
                "&:hover": {
                  backgroundColor: alpha(
                    customTheme.palette.primary.main,
                    0.15
                  ),
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: "20%",
                  height: "60%",
                  width: 4,
                  backgroundColor: "primary.main",
                  borderRadius: "0 4px 4px 0",
                },
              },
              "&:hover": {
                backgroundColor: alpha(customTheme.palette.primary.main, 0.05),
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: tabIndex === 1 ? "primary.main" : "text.secondary",
                minWidth: 44,
              }}
            >
              <Description />
            </ListItemIcon>
            <ListItemText
              primary="My Policies"
              primaryTypographyProps={{
                fontWeight: tabIndex === 1 ? 600 : 500,
                color: tabIndex === 1 ? "primary.main" : "text.primary",
              }}
            />
          </ListItem>
          <ListItem
            button
            selected={tabIndex === 2}
            onClick={() => handleTabChange(2)}
            sx={{
              py: 1.5,
              mb: 1.5,
              borderRadius: 3,
              "&.Mui-selected": {
                backgroundColor: alpha(customTheme.palette.primary.main, 0.1),
                "&:hover": {
                  backgroundColor: alpha(
                    customTheme.palette.primary.main,
                    0.15
                  ),
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: "20%",
                  height: "60%",
                  width: 4,
                  backgroundColor: "primary.main",
                  borderRadius: "0 4px 4px 0",
                },
              },
              "&:hover": {
                backgroundColor: alpha(customTheme.palette.primary.main, 0.05),
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: tabIndex === 2 ? "primary.main" : "text.secondary",
                minWidth: 44,
              }}
            >
              <SupportAgent />
            </ListItemIcon>
            <ListItemText
              primary="Support"
              primaryTypographyProps={{
                fontWeight: tabIndex === 2 ? 600 : 500,
                color: tabIndex === 2 ? "primary.main" : "text.primary",
              }}
            />
          </ListItem>
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            py: 1.2,
            borderRadius: 3,
            borderWidth: 1.5,
            boxShadow: "none",
            "&:hover": {
              borderWidth: 1.5,
              backgroundColor: alpha(customTheme.palette.primary.main, 0.04),
              boxShadow: "0 4px 12px rgba(67, 97, 238, 0.15)",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </>
  );

  return (
    <ThemeProvider theme={customTheme}>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "background.default",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Sidebar */}
        <Box
          component="nav"
          sx={{
            width: { md: drawerWidth },
            flexShrink: { md: 0 },
          }}
          aria-label="navigation drawer"
        >
          {/* Mobile drawer */}
          <Drawer
            variant="temporary"
            open={isMobile && openDrawer}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                boxShadow: "4px 0 24px rgba(0,0,0,0.10)",
                border: "none",
              },
              "& .MuiBackdrop-root": {
                backdropFilter: "blur(2px)",
              },
            }}
          >
            {drawer}
          </Drawer>

          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                boxShadow: "4px 0 24px rgba(0,0,0,0.05)",
                border: "none",
                position: "relative",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            height: "100vh",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* App Bar */}
          <AppBar
            position="sticky"
            elevation={0}
            sx={{
              bgcolor: "background.paper",
              borderBottom: "1px solid",
              borderColor: alpha("#000", 0.06),
              top: 0,
              zIndex: (theme) => theme.zIndex.drawer - 1,
            }}
          >
            <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  mr: 2,
                  display: { md: "none" },
                  bgcolor: alpha(customTheme.palette.primary.main, 0.06),
                  "&:hover": {
                    bgcolor: alpha(customTheme.palette.primary.main, 0.12),
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h5"
                component="div"
                sx={{ flexGrow: 1, fontWeight: 700, color: "text.primary" }}
              >
                {renderSectionTitle()}
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Content area */}
          <Container
            maxWidth="xl"
            sx={{
              py: { xs: 3, md: 4 },
              px: { xs: 2, sm: 3, md: 4 },
              flexGrow: 1,
              overflowY: "visible",
            }}
          >
            {/* Main Content */}
            <Paper
              elevation={0}
              sx={{
                overflow: "visible",
                bgcolor: "background.paper",
                height: "auto",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                border: "1px solid",
                borderColor: alpha("#000", 0.05),
              }}
            >
              <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Fade in timeout={500}>
                  <Box>{renderView()}</Box>
                </Fade>
              </Box>
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
