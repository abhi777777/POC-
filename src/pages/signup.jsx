import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  Alert,
  Avatar,
  Fade,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
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
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!validateEmail(formData.email))
      newErrors.email = "Enter a valid email address";
    if (!validateMobile(formData.mobile))
      newErrors.mobile = "Mobile number must be 10 digits";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const fullName = `${formData.firstName} ${formData.middleName ? formData.middleName + " " : ""}${formData.lastName}`;

    const payload = {
      name: fullName.trim(),
      email: formData.email,
      mobile: formData.mobile,
      dob: formData.dob,
      address: formData.address,
      role: formData.role,
      password: formData.password,
    };

    try {
      await axios.post("http://localhost:4000/api/users/register", payload);
      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.error || "Something went wrong during signup";
      setSubmitError(message);
    }
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
            <Avatar sx={{ bgcolor: "primary.main", mx: "auto" }}>
              <PersonAddIcon />
            </Avatar>

            <Typography variant="h5" fontWeight={600}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please fill the details to sign up
            </Typography>

            {submitError && <Alert severity="error">{submitError}</Alert>}

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
          </Box>
        </Fade>
      </Box>
    </ThemeProvider>
  );
}
