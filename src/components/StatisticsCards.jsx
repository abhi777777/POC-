import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  useTheme,
} from "@mui/material";
import { ShieldOutlined, TrendingUp, Person } from "@mui/icons-material";

const StatisticsCards = ({ statsData }) => {
  const theme = useTheme();

  const cardStyle = {
    borderRadius: 2,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
    },
  };

  const cardData = [
    {
      title: "Total Policies",
      value: statsData.totalPolicies,
      icon: <ShieldOutlined fontSize="medium" />,
      color: theme.palette.primary.main,
      bgColor: "rgba(25, 118, 210, 0.1)",
    },
    {
      title: "Policies Sold",
      value: statsData.policiesSold,
      icon: <TrendingUp fontSize="medium" />,
      color: "#ff9800",
      bgColor: "rgba(255, 152, 0, 0.1)",
    },

    {
      title: "Revenue",
      value: statsData.revenue,
      icon: <TrendingUp fontSize="medium" />,
      color: "#9c27b0",
      bgColor: "rgba(156, 39, 176, 0.1)",
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {cardData.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={cardStyle}>
            <CardContent sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  bgcolor: card.bgColor,
                  color: card.color,
                  marginRight: 2,
                  width: 56,
                  height: 56,
                }}
              >
                {card.icon}
              </Avatar>
              <Box>
                <Typography color="textSecondary" variant="body2">
                  {card.title}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {card.value}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatisticsCards;
