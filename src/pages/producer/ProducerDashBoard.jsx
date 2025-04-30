import React, { useState } from "react";
import { Box, Typography, Paper, Tabs, Tab, Fade } from "@mui/material";
import { ListAlt, AddCircle } from "@mui/icons-material";
import PoliciesList from "../../components/PoliciesList";
import CreatePolicyForm from "../../components/CreatePolicyForm";

export default function ProducerDashboard() {
  const [value, setValue] = useState(0); // Index of the active tab

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
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
    </Box>
  );
}
