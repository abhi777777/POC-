import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ThemeProvider,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Avatar,
  Fade,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Theme from "../theme/Theme";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:4000/api/users/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      const { token, role } = res.data;

      switch (role) {
        case "producer":
          navigate("/ProducerDashBoard");
          break;
        case "consumer":
          navigate("/ConsumerDashBoard");
          break;

        default:
          console.error("Unknown role");
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const isValid =
    formData.email.trim() !== "" &&
    formData.password.trim() !== "" &&
    formData.role.trim() !== "";

  return (
    <ThemeProvider theme={Theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,rgb(186, 202, 255), #FFFFFF)",
        }}
      >
        <Fade in={true} timeout={600}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: 400,
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 4,
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              gap: 3,
              textAlign: "center",
            }}
          >
            <Avatar sx={{ bgcolor: "primary.main", mx: "auto" }}>
              <LockOutlinedIcon />
            </Avatar>

            <Typography variant="h5" fontWeight={600}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please enter your credentials to continue
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              required
            />

            <FormControl fullWidth required>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <MenuItem value="consumer">Consumer</MenuItem>
                <MenuItem value="producer">Producer</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={!isValid}
              sx={{
                py: 1.5,
                fontWeight: 600,
                letterSpacing: 1,
                borderRadius: 2,
              }}
            >
              Log In
            </Button>

            <Typography variant="body2">
              New here?{" "}
              <Link component="button" variant="body2" onClick={handleSignup}>
                Create an account
              </Link>
            </Typography>
          </Box>
        </Fade>
      </Box>
    </ThemeProvider>
  );
}
