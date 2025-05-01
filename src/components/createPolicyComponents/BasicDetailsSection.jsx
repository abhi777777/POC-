// src/components/CreatePolicyForm/BasicDetailsSection.jsx
import React from "react";
import {
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

const BasicDetailsSection = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Typography variant="subtitle1">Basic Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth required>
            <InputLabel>Title</InputLabel>
            <Select
              name="title"
              value={formData.title}
              onChange={handleChange}
              label="Title"
            >
              <MenuItem value="Mr">Mr</MenuItem>
              <MenuItem value="Mrs">Miss</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Policy Title"
            name="policyTitle"
            value={formData.policyTitle}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            fullWidth
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            label="Middle Name"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            fullWidth
            error={!!errors.middleName}
            helperText={errors.middleName}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            fullWidth
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            fullWidth
            error={!!errors.mobile}
            helperText={errors.mobile}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Date of Birth"
            name="dob"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.dob}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Income"
            name="income"
            type="number"
            value={formData.income}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1">Gender</Typography>
          <RadioGroup
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            row
          >
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Female"
            />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
        </Grid>
      </Grid>
    </>
  );
};

export default BasicDetailsSection;
