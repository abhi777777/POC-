import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import { RemoveCircle, AddCircle } from "@mui/icons-material";

// Initial state
const initialState = {
  title: "",
  policyTitle: "",
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  mobile: "",
  address: "",
  occupation: "",
  dob: "",
  income: "",
  gender: "",
  heightCm: "",
  heightFt: "",
  heightInches: "",
  weight: "",
  bmi: "",
  lifestyle: {
    smoking: { freq: "", quantity: "" },
    drinking: { freq: "", quantity: "" },
    panMasala: { freq: "", quantity: "" },
    others: "",
  },
  medicalHistory: "",
  nominees: [{ name: "", relation: "", gender: "", contribution: "" }],
  additional: { pan: "", aadhar: "", gstNumber: "" },
};

const heightToMeters = (ft, inches) => {
  const totalInches = ft * 12 + inches;
  return totalInches * 0.0254; // Convert to meters
};

export default function CreatePolicyForm() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const { heightFt, heightInches, weight } = formData;
    if (heightFt && heightInches && weight) {
      const heightM = heightToMeters(Number(heightFt), Number(heightInches));
      const bmiVal = (weight / (heightM * heightM)).toFixed(2);
      setFormData((prev) => ({ ...prev, bmi: bmiVal }));
    }
  }, [formData.heightFt, formData.heightInches, formData.weight]);
  useEffect(() => {
    if (formData.heightCm) {
      const totalInches = formData.heightCm / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);

      setFormData((prev) => ({
        ...prev,
        heightFt: feet,
        heightInches: inches,
      }));
    }
  }, [formData.heightCm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLifestyleChange = (section, field) => (e) => {
    const { value } = e.target;
    if (!field) {
      setFormData((prev) => ({
        ...prev,
        lifestyle: { ...prev.lifestyle, [section]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        lifestyle: {
          ...prev.lifestyle,
          [section]: { ...prev.lifestyle[section], [field]: value },
        },
      }));
    }
  };

  const handleAdditionalChange = (field) => (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      additional: { ...prev.additional, [field]: value },
    }));
  };

  const handleNomineeChange = (index, field) => (e) => {
    const { value } = e.target;
    const nominees = [...formData.nominees];
    nominees[index][field] = value;
    setFormData((prev) => ({ ...prev, nominees }));
  };

  const addNominee = () => {
    setFormData((prev) => ({
      ...prev,
      nominees: [
        ...prev.nominees,
        { name: "", relation: "", gender: "", contribution: "" },
      ],
    }));
  };

  const removeNominee = (index) => {
    setFormData((prev) => ({
      ...prev,
      nominees: prev.nominees.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    const { firstName, middleName, lastName, email, mobile } = formData;

    // Validate First Name, Middle Name, Last Name
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(firstName))
      newErrors.firstName = "First Name can't contain numbers";
    if (middleName && !nameRegex.test(middleName))
      newErrors.middleName = "Middle Name can't contain numbers";
    if (!nameRegex.test(lastName))
      newErrors.lastName = "Last Name can't contain numbers";

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) newErrors.email = "Invalid email format";

    // Validate mobile
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) newErrors.mobile = "Invalid mobile number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post(
        "http://localhost:4000/api/policy/CreatePolicies",
        formData,
        { withCredentials: true }
      );
      alert("Policy created successfully!");
      setFormData(initialState);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error creating policy");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        maxWidth: 900,
        mx: "auto",
      }}
    >
      <Typography variant="h6">Create New Policy</Typography>

      {/* Basic Details Section */}
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
          <FormControl fullWidth required>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              label="Gender"
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* BMI Section */}
      <Typography variant="subtitle1">BMI Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Height (cm)"
            name="heightCm"
            type="number"
            value={formData.heightCm}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Height (ft)"
            name="heightFt"
            type="number"
            value={formData.heightFt}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Height (inches)"
            name="heightInches"
            type="number"
            value={formData.heightInches}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Weight (kg)"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="BMI"
            name="bmi"
            value={formData.bmi}
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Grid>
      </Grid>

      {/* Lifestyle Section */}
      <Typography variant="subtitle1">Lifestyle</Typography>
      <Grid container spacing={2}>
        {[
          { key: "smoking", label: "Smoking" },
          { key: "drinking", label: "Drinking" },
          { key: "panMasala", label: "Pan Masala" },
        ].map(({ key, label }) => (
          <React.Fragment key={key}>
            <Grid item xs={12} sm={3}>
              <TextField
                label={`${label} Freq`}
                value={formData.lifestyle[key].freq}
                onChange={handleLifestyleChange(key, "freq")}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Quantity"
                value={formData.lifestyle[key].quantity}
                onChange={handleLifestyleChange(key, "quantity")}
                fullWidth
              />
            </Grid>
          </React.Fragment>
        ))}
        <Grid item xs={12}>
          <TextField
            label="Other Habits"
            value={formData.lifestyle.others}
            onChange={handleLifestyleChange("others")}
            fullWidth
          />
        </Grid>
      </Grid>

      {/* Medical History */}
      <Typography variant="subtitle1">Medical History</Typography>
      <TextField
        label="Medical History"
        name="medicalHistory"
        value={formData.medicalHistory}
        onChange={handleChange}
        multiline
        rows={4}
        fullWidth
      />

      {/* Nominees Section */}
      <Typography variant="subtitle1">Nominees</Typography>
      {formData.nominees.map((nom, idx) => (
        <Grid container spacing={2} alignItems="center" key={idx}>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Name"
              value={nom.name}
              onChange={handleNomineeChange(idx, "name")}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Relation"
              value={nom.relation}
              onChange={handleNomineeChange(idx, "relation")}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth required>
              <InputLabel id={`nominee-gender-${idx}`}>Gender</InputLabel>
              <Select
                labelId={`nominee-gender-${idx}`}
                value={nom.gender}
                onChange={handleNomineeChange(idx, "gender")}
                label="Gender"
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Contribution"
              value={nom.contribution}
              onChange={handleNomineeChange(idx, "contribution")}
              fullWidth
              required
            />
          </Grid>
          {idx > 0 && (
            <Grid item xs={12} sm={1}>
              <IconButton onClick={() => removeNominee(idx)} color="error">
                <RemoveCircle />
              </IconButton>
            </Grid>
          )}
        </Grid>
      ))}
      <Button
        type="button"
        variant="outlined"
        startIcon={<AddCircle />}
        onClick={addNominee}
        sx={{ alignSelf: "flex-start" }}
      >
        Add Nominee
      </Button>

      {/* Additional Information */}
      <Typography variant="subtitle1">Additional Information</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Pan Number"
            name="pan"
            value={formData.additional.pan}
            onChange={handleAdditionalChange("pan")}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Aadhar Number"
            name="aadhar"
            value={formData.additional.aadhar}
            onChange={handleAdditionalChange("aadhar")}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="GST Number"
            name="gstNumber"
            value={formData.additional.gstNumber}
            onChange={handleAdditionalChange("gstNumber")}
            fullWidth
          />
        </Grid>
      </Grid>

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
}
