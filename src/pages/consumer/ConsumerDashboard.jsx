import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Tabs,
  Tab,
  Fade,
  Slide,
  Zoom,
} from "@mui/material";
import { ShoppingCart, Assignment, HelpOutline } from "@mui/icons-material";
import BuyPolicy from "../../components/BuyPolicy";
import PurchasedPolicies from "../../components/PurchasedPolicies";
import RaiseTicketForm from "../../components/RaiseTicketForm";

export default function ConsumerDashboard() {
  const [value, setValue] = useState(0); // Index of the active tab

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
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
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
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
          <Tab
            icon={<ShoppingCart />}
            label="Buy Policy"
            aria-label="Buy Policy"
          />
          <Tab
            icon={<Assignment />}
            label="My Policies"
            aria-label="My Policies"
          />
          <Tab
            icon={<HelpOutline />}
            label="Raise Ticket"
            aria-label="Raise Ticket"
          />
        </Tabs>

        {/* Section Transition Animation */}
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <Box sx={{ mt: 2 }}>
            <Fade in timeout={400}>
              <Box>{renderView()}</Box>
            </Fade>
          </Box>
        </Slide>
      </Card>
    </Box>
  );
}
