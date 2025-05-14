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
  Paper,
  Card,
  CardContent,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
// Material UI icons
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import BadgeIcon from "@mui/icons-material/Badge";
import WcIcon from "@mui/icons-material/Wc";

const StepOne = ({ errors, touched }) => {
  const { values, handleChange, handleBlur } = useFormikContext();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Helper function to get field error state
  const hasError = (field) => touched[field] && Boolean(errors[field]);
  const getErrorMessage = (field) => touched[field] && errors[field];

  return (
    <Fade in timeout={600}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(145deg, #2d2d2d 0%, #1f1f1f 100%)"
              : "linear-gradient(145deg, #f9f9f9 0%, #ffffff 100%)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: "bold",
            color: theme.palette.primary.main,
            display: "flex",
            alignItems: "center",
            "&:after": {
              content: '""',
              display: "block",
              height: "2px",
              background: theme.palette.primary.main,
              flex: 1,
              ml: 2,
              borderRadius: 1,
              opacity: 0.7,
            },
          }}
        >
          Personal Information
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ mb: 2, fontStyle: "italic" }}
          >
            Please provide your basic details. Fields marked with * are
            required.
          </Typography>
        </Box>

        {/* Personal Details Card */}
        <Card
          variant="outlined"
          sx={{
            mb: 4,
            borderRadius: 2,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            },
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  mr: 2,
                }}
              >
                <BadgeIcon />
              </Avatar>
              <Typography variant="h6">Identity Details</Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Title */}
              <Grid item xs={12} sm={6} md={3}>
                <Tooltip
                  title="Select your preferred title"
                  placement="top"
                  arrow
                  enterDelay={500}
                >
                  <FormControl
                    fullWidth
                    error={hasError("title")}
                    size="small"
                    variant="outlined"
                  >
                    <InputLabel id="title-label">Title*</InputLabel>
                    <Select
                      labelId="title-label"
                      name="title"
                      value={values.title || ""}
                      label="Title*"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      displayEmpty
                      startAdornment={
                        <InputAdornment position="start">
                          <PersonIcon fontSize="small" color="action" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>Select Title</em>
                      </MenuItem>
                      <MenuItem value="Mr">Mr</MenuItem>
                      <MenuItem value="Mrs">Mrs</MenuItem>
                      <MenuItem value="Miss">Miss</MenuItem>
                      <MenuItem value="Dr">Dr</MenuItem>
                      <MenuItem value="Prof">Prof</MenuItem>
                    </Select>
                    {hasError("title") && (
                      <FormHelperText>
                        {getErrorMessage("title")}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Tooltip>
              </Grid>

              {/* First Name */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="First Name*"
                  name="firstName"
                  value={values.firstName || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  required
                  size="small"
                  error={hasError("firstName")}
                  helperText={getErrorMessage("firstName")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                    pattern: "^[A-Za-z ]+$",
                    title: "Only alphabets and spaces allowed",
                  }}
                />
              </Grid>

              {/* Middle Name */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Middle Name"
                  name="middleName"
                  value={values.middleName || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  size="small"
                  error={hasError("middleName")}
                  helperText={getErrorMessage("middleName")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon fontSize="small" color="action" />
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
                  label="Last Name*"
                  name="lastName"
                  value={values.lastName || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  required
                  size="small"
                  error={hasError("lastName")}
                  helperText={getErrorMessage("lastName")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                    pattern: "^[A-Za-z ]+$",
                    title: "Only alphabets and spaces allowed",
                  }}
                />
              </Grid>

              {/* Gender */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(0,0,0,0.02)",
                    border: `1px solid ${theme.palette.divider}`,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: isSmallScreen ? "column" : "row",
                    alignItems: isSmallScreen ? "flex-start" : "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mr: isSmallScreen ? 0 : 4,
                      mb: isSmallScreen ? 1 : 0,
                    }}
                  >
                    <WcIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">Gender*</Typography>
                  </Box>

                  <Slide direction="right" in timeout={800}>
                    <RadioGroup
                      name="gender"
                      row
                      value={values.gender || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <FormControlLabel
                        value="Male"
                        control={<Radio color="primary" size="small" />}
                        label={<Typography variant="body2">Male</Typography>}
                      />
                      <FormControlLabel
                        value="Female"
                        control={<Radio color="primary" size="small" />}
                        label={<Typography variant="body2">Female</Typography>}
                      />
                      <FormControlLabel
                        value="Other"
                        control={<Radio color="primary" size="small" />}
                        label={<Typography variant="body2">Other</Typography>}
                      />
                    </RadioGroup>
                  </Slide>
                </Box>
                {hasError("gender") && (
                  <FormHelperText error sx={{ ml: 2 }}>
                    {getErrorMessage("gender")}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Contact Information Card */}
        <Card
          variant="outlined"
          sx={{
            mb: 4,
            borderRadius: 2,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            },
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.success.light,
                  color: theme.palette.success.contrastText,
                  mr: 2,
                }}
              >
                <PhoneIcon />
              </Avatar>
              <Typography variant="h6">Contact Information</Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email*"
                  name="email"
                  type="email"
                  value={values.email || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  required
                  size="small"
                  error={hasError("email")}
                  helperText={getErrorMessage("email")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Mobile */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mobile*"
                  name="mobile"
                  type="number"
                  value={values.mobile || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  required
                  size="small"
                  error={hasError("mobile")}
                  helperText={getErrorMessage("mobile")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12}>
                <TextField
                  label="Address*"
                  name="address"
                  value={values.address || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  required
                  size="small"
                  multiline
                  rows={2}
                  error={hasError("address")}
                  helperText={getErrorMessage("address")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Professional Information Card */}
        <Card
          variant="outlined"
          sx={{
            borderRadius: 2,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            },
          }}
        >
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.info.light,
                  color: theme.palette.info.contrastText,
                  mr: 2,
                }}
              >
                <WorkIcon />
              </Avatar>
              <Typography variant="h6">
                Professional & Additional Information
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {/* Occupation */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Occupation*"
                  name="occupation"
                  value={values.occupation || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  required
                  size="small"
                  error={hasError("occupation")}
                  helperText={getErrorMessage("occupation")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WorkIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* DOB */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Date of Birth*"
                  type="date"
                  name="dob"
                  value={values.dob || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  required
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  error={hasError("dob")}
                  helperText={getErrorMessage("dob") || "MM/DD/YYYY"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Income */}
              <Grid item xs={12} sm={6} md={4}>
                <Tooltip
                  title="Annual income in your local currency"
                  placement="top"
                  arrow
                  enterDelay={500}
                >
                  <TextField
                    label="Annual Income*"
                    name="income"
                    type="number"
                    value={values.income || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    required
                    size="small"
                    error={hasError("income")}
                    helperText={getErrorMessage("income")}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MonetizationOnIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Tooltip>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, textAlign: "right" }}>
          <Typography variant="caption" color="textSecondary">
            All information will be kept confidential and secure
          </Typography>
        </Box>
      </Paper>
    </Fade>
  );
};

export default StepOne;
