import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux"; // Keep this import here
import { signupUser } from "../Slices/userSlice";
import {
  ThemeProvider,
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Fade,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Theme from "../theme/Theme";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    mobile: "",
    dob: "",
    address: "",
    password: "",
    confirmPassword: "",
    role: "consumer",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch(); // This should be inside the component

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateMobile = (mobile) => /^\d{10}$/.test(mobile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    let error = "";
    switch (name) {
      case "firstName":
        if (!value.trim()) error = "First name is required";
        break;
      case "lastName":
        if (!value.trim()) error = "Last name is required";
        break;
      case "email":
        if (!validateEmail(value)) error = "Enter a valid email address";
        break;
      case "mobile":
        if (!validateMobile(value)) error = "Mobile number must be 10 digits";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!formData.firstName.trim())
      validationErrors.firstName = "First name is required";
    if (!formData.lastName.trim())
      validationErrors.lastName = "Last name is required";
    if (!validateEmail(formData.email))
      validationErrors.email = "Enter a valid email";
    if (!validateMobile(formData.mobile))
      validationErrors.mobile = "Invalid mobile number";
    if (formData.password !== formData.confirmPassword)
      validationErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    dispatch(signupUser(formData)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setTimeout(() => navigate("/login"), 1500);
      }
    });
  };

  const isValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.mobile &&
    formData.password &&
    formData.confirmPassword &&
    Object.values(errors).every((err) => !err);

  return (
    <ThemeProvider theme={Theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FFEFBA, #FFFFFF)",
        }}
      >
        <Fade in={true} timeout={600}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: 500,
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 4,
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              textAlign: "center",
            }}
          >
            <ToastContainer />
            <Avatar sx={{ bgcolor: "primary.main", mx: "auto" }}>
              <PersonAddIcon />
            </Avatar>

            <Typography variant="h5" fontWeight={600}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please fill the details to sign up
            </Typography>

            <TextField
              label="First Name"
              name="firstName"
              fullWidth
              value={formData.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />

            <TextField
              label="Middle Name"
              name="middleName"
              fullWidth
              value={formData.middleName}
              onChange={handleChange}
            />

            <TextField
              label="Last Name"
              name="lastName"
              fullWidth
              value={formData.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              label="Mobile Number"
              name="mobile"
              type="tel"
              fullWidth
              value={formData.mobile}
              onChange={handleChange}
              error={!!errors.mobile}
              helperText={errors.mobile}
            />

            <TextField
              label="Date of Birth"
              name="dob"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.dob}
              onChange={handleChange}
            />

            <TextField
              label="Address"
              name="address"
              fullWidth
              value={formData.address}
              onChange={handleChange}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
            />

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              fullWidth
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />

            <FormControl fullWidth>
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
                <MenuItem value="ticketHandler">Ticket Handler</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
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
              Sign Up
            </Button>

            <Typography variant="body2">
              Already have an account?{" "}
              <Link
                to="/login"
                style={{ color: "#1976d2", textDecoration: "none" }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </Fade>
      </Box>
    </ThemeProvider>
  );
}
