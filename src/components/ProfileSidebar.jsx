import React from "react";
import {
  Drawer,
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { Person, Logout } from "@mui/icons-material";

const ProfileSidebar = ({
  isOpen,
  onClose,
  userInfo,
  loading,
  error,
  onLogout,
  isMobile,
}) => {
  const theme = useTheme();

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        width: isMobile ? "70%" : 350,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isMobile ? "70%" : 350,
          paddingTop: 2,
          backgroundColor: "#fff",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          p: 3,
        }}
      >
        <Box>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                backgroundColor: theme.palette.primary.main,
                margin: "0 auto 16px",
                fontSize: "2rem",
              }}
            >
              {userInfo?.name?.charAt(0) || <Person fontSize="large" />}
            </Avatar>

            <Typography variant="h5" fontWeight={600} color="primary">
              User Profile
            </Typography>

            {userInfo?.role && (
              <Chip
                label={userInfo.role}
                size="small"
                sx={{
                  mt: 1,
                  fontWeight: 500,
                  backgroundColor: "rgba(25, 118, 210, 0.1)",
                  color: theme.palette.primary.main,
                }}
              />
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* User Info Display */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography
              color="error"
              sx={{ textAlign: "center", my: 2, px: 2 }}
            >
              {error}
            </Typography>
          ) : userInfo ? (
            <List
              sx={{
                "& .MuiListItem-root": {
                  py: 1.5,
                  borderBottom: "1px solid #f0f0f0",
                },
              }}
            >
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="textSecondary">
                      Full Name
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" fontWeight={500}>
                      {userInfo.name || "N/A"}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="textSecondary">
                      Email
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" fontWeight={500}>
                      {userInfo.email || "N/A"}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="textSecondary">
                      Phone
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body1" fontWeight={500}>
                      {userInfo.phone || "N/A"}
                    </Typography>
                  }
                />
              </ListItem>
              {userInfo.address && (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="body2" color="textSecondary">
                        Address
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body1" fontWeight={500}>
                        {userInfo.address}
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
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
          onClick={onLogout}
          sx={{
            py: 1.2,
            borderRadius: 2,
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(255, 68, 68, 0.3)",
            "&:hover": {
              boxShadow: "0 6px 14px rgba(255, 68, 68, 0.4)",
            },
          }}
          startIcon={<Logout />}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
};

export default ProfileSidebar;
