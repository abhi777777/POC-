import React from "react";
import { useFormikContext } from "formik";
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
  Tooltip,
  InputAdornment,
  Fade,
  Slide,
  Box,
} from "@mui/material";
// Switched to MUI icons to avoid lucide-react import issues
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PhoneIcon from "@mui/icons-material/Phone";

const StepOne = ({ errors, touched }) => {
  const { values, handleChange, handleBlur } = useFormikContext();

  const fieldProps = {
    fullWidth: true,
    onBlur: handleBlur,
    onChange: handleChange,
    sx: { maxWidth: 300 },
  };

  return (
    <Fade in timeout={600}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Step 1: Basic Details
        </Typography>
        <Grid container spacing={3}>
          {/* Title with tooltip */}
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title="Select your prefix" placement="top" arrow>
              <FormControl
                fullWidth
                error={touched.title && Boolean(errors.title)}
                sx={{ maxWidth: 300 }}
              >
                <InputLabel shrink>Title*</InputLabel>
                <Select
                  name="title"
                  value={values.title}
                  {...fieldProps}
                  displayEmpty
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">
                    <em>Select Title</em>
                  </MenuItem>
                  <MenuItem value="Mr">Mr</MenuItem>
                  <MenuItem value="Mrs">Mrs</MenuItem>
                  <MenuItem value="Miss">Miss</MenuItem>
                </Select>
                {touched.title && errors.title && (
                  <FormHelperText>{errors.title}</FormHelperText>
                )}
              </FormControl>
            </Tooltip>
          </Grid>

          {/* First Name */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="First Name"
              name="firstName"
              value={values.firstName}
              {...fieldProps}
              required
              error={touched.firstName && Boolean(errors.firstName)}
              helperText={touched.firstName && errors.firstName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon fontSize="small" />
                  </InputAdornment>
                ),
                pattern: "^[A-Za-z ]+$",
                title: "Only alphabets and spaces allowed",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Middle Name"
              name="middleName"
              value={values.middleName}
              {...fieldProps}
              error={touched.middleName && Boolean(errors.middleName)}
              helperText={touched.middleName && errors.middleName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon fontSize="small" />
                  </InputAdornment>
                ),
                pattern: "^[A-Za-z ]+$",
                title: "Only alphabets and spaces allowed",
              }}
            />
          </Grid>

          {/* Last Name */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Last Name"
              name="lastName"
              value={values.lastName}
              {...fieldProps}
              required
              error={touched.lastName && Boolean(errors.lastName)}
              helperText={touched.lastName && errors.lastName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon fontSize="small" />
                  </InputAdornment>
                ),
                pattern: "^[A-Za-z ]+$",
                title: "Only alphabets and spaces allowed",
              }}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={values.email}
              {...fieldProps}
              required
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Mobile */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Mobile"
              name="mobile"
              type="tel"
              value={values.mobile}
              {...fieldProps}
              required
              error={touched.mobile && Boolean(errors.mobile)}
              helperText={touched.mobile && errors.mobile}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              value={values.address}
              {...fieldProps}
              required
              error={touched.address && Boolean(errors.address)}
              helperText={touched.address && errors.address}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HomeIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Occupation */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Occupation"
              name="occupation"
              value={values.occupation}
              {...fieldProps}
              required
              error={touched.occupation && Boolean(errors.occupation)}
              helperText={touched.occupation && errors.occupation}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WorkIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* DOB */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Date of Birth"
              type="date"
              name="dob"
              value={values.dob}
              {...fieldProps}
              required
              InputLabelProps={{ shrink: true }}
              error={touched.dob && Boolean(errors.dob)}
              helperText={touched.dob && errors.dob}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Income */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Income"
              name="income"
              type="number"
              value={values.income}
              {...fieldProps}
              required
              error={touched.income && Boolean(errors.income)}
              helperText={touched.income && errors.income}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MonetizationOnIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Gender */}
          <Grid item xs={12} md={8}>
            <Typography variant="subtitle1" gutterBottom>
              Gender *
            </Typography>
            <Slide direction="right" in timeout={800}>
              <RadioGroup
                name="gender"
                row
                value={values.gender}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <FormControlLabel
                  value="Male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="Female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="Other"
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
            </Slide>
            {touched.gender && errors.gender && (
              <FormHelperText error>{errors.gender}</FormHelperText>
            )}
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default StepOne;
