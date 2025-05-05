import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";

// Regex patterns
const NAME_REGEX = /^[A-Za-z]+$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,6}$/;
const MOBILE_REGEX = /^[0-9]{10}$/;

export default function BasicDetailsSection({
  formData,
  setFormData,
  setStepValid,
}) {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "firstName":
      case "lastName":
        if (!value || !NAME_REGEX.test(value)) {
          error = "Only letters allowed";
        }
        break;
      case "middleName":
        if (value && !NAME_REGEX.test(value)) {
          error = "Only letters allowed";
        }
        break;
      case "email":
        if (!value || !EMAIL_REGEX.test(value)) {
          error = "Invalid email format";
        }
        break;
      case "mobile":
        if (!MOBILE_REGEX.test(value)) {
          error = "Must be exactly 10 digits";
        }
        break;
      case "income":
        if (!value || !Number.isInteger(Number(value))) {
          error = "Income must be an integer";
        }
        break;
      case "address":
      case "occupation":
      case "dob":
      case "title":
      case "gender":
        if (!value) {
          error = "This field is required";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  useEffect(() => {
    const requiredFields = [
      "title",
      "firstName",
      "lastName",
      "email",
      "mobile",
      "dob",
      "income",
      "occupation",
      "address",
      "gender",
    ];

    const allValid = requiredFields.every((field) =>
      validateField(field, formData[field])
    );

    setStepValid(allValid);
  }, [formData]);

  return (
    <>
      <Typography variant="subtitle1">Basic Details</Typography>
      <Grid container spacing={2}>
        {/* Title Dropdown */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth error={!!errors.title}>
            <InputLabel shrink>Title*</InputLabel>
            <Select
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              displayEmpty
              notched
            >
              <MenuItem value="">
                <em>Select Title</em>
              </MenuItem>
              <MenuItem value="Mr">Mr</MenuItem>
              <MenuItem value="Mrs">Mrs</MenuItem>
              <MenuItem value="Miss">Miss</MenuItem>
            </Select>
            <FormHelperText>{errors.title}</FormHelperText>
          </FormControl>
        </Grid>

        {/* First Name */}
        <Grid item xs={12} sm={2}>
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            fullWidth
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
        </Grid>

        {/* Middle Name */}
        <Grid item xs={12} sm={2}>
          <TextField
            label="Middle Name"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            error={!!errors.middleName}
            helperText={errors.middleName}
          />
        </Grid>

        {/* Last Name */}
        <Grid item xs={12} sm={2}>
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            fullWidth
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
        </Grid>

        {/* Email */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            fullWidth
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>

        {/* Mobile */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            fullWidth
            error={!!errors.mobile}
            helperText={errors.mobile}
          />
        </Grid>

        {/* Address */}
        <Grid item xs={12}>
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            fullWidth
            error={!!errors.address}
            helperText={errors.address}
          />
        </Grid>

        {/* Occupation */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            fullWidth
            error={!!errors.occupation}
            helperText={errors.occupation}
          />
        </Grid>

        {/* DOB */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Date of Birth"
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            onBlur={handleBlur}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
            error={!!errors.dob}
            helperText={errors.dob}
          />
        </Grid>

        {/* Income */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Income"
            name="income"
            value={formData.income}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            fullWidth
            error={!!errors.income}
            helperText={errors.income}
          />
        </Grid>

        {/* Gender */}
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1">Gender</Typography>
          <RadioGroup
            name="gender"
            row
            value={formData.gender}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Female"
            />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
          {errors.gender && (
            <FormHelperText error>{errors.gender}</FormHelperText>
          )}
        </Grid>
      </Grid>
    </>
  );
}
