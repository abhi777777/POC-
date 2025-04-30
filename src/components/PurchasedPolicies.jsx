import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Avatar,
} from "@mui/material";
import PolicyIcon from "@mui/icons-material/Description";

export default function PurchasedPolicies() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMy() {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/policy/purchases",
          {
            withCredentials: true,
          }
        );
        setPurchases(res.data.purchases);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMy();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        My Purchased Policies
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : purchases.length === 0 ? (
        <Box textAlign="center" mt={5}>
          <Typography variant="h6">No policies purchased yet.</Typography>
          {/* You can place an illustration or icon here if desired */}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {purchases.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p._id}>
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: "#ffbb00" }}>
                      <PolicyIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {p.policy?.policyTitle || "Untitled Policy"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Purchased on:{" "}
                        {new Date(p.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
