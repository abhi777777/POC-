import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ThemeProvider,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Avatar,
  Fade,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Theme from "../theme/Theme";
import axios from "axios";

// NEW: Redux
import { useDispatch } from "react-redux";
import { setUserInfo } from "../Slices/userSlice";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch(); // NEW

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      const res = await axios.post(
        "http://localhost:4000/api/users/login",
        {
          email: formData.email.trim(),
          password: formData.password.trim(),
        },
        {
          withCredentials: true,
        }
      );

      const { token, role, email } = res.data;

      dispatch(setUserInfo({ token, role, email }));

      switch (role) {
        case "producer":
          navigate("/ProducerDashBoard");
          break;
        case "consumer":
          navigate("/ConsumerDashBoard");
          break;
        default:
          console.error("Unknown role");
          setError("Unexpected user role");
      }
    } catch (err) {
      console.error("Login failed", err);
      setError("Invalid email or password");
    }
  };

  const handleSignup = () => {
    setFormData({ email: "", password: "" });
    navigate("/signup");
  };

  const isValid =
    formData.email.trim() !== "" && formData.password.trim() !== "";

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
            autoComplete="off"
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
              autoComplete="off"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              required
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="off"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              required
            />

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
