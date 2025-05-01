// src/components/CreatePolicyForm/index.jsx
import React, { useState } from "react";
import axios from "axios";
import { Box, Typography, Button } from "@mui/material";

import { initialState } from "./createPolicyComponents/formState";

import BasicDetailsSection from "./createPolicyComponents/BasicDetailsSection";
import BMIDetailsSection from "./createPolicyComponents/BMIDetailsSection";
import LifestyleSection from "./createPolicyComponents/LifestyleSection";
import MedicalHistorySection from "./createPolicyComponents/MedicalHistorySection";
import NomineesSection from "./createPolicyComponents/NomineesSection";
import AdditionalInfoSection from "./createPolicyComponents/AdditionalInfoSection";

export default function CreatePolicyForm() {
  // Ensure initialState is properly imported and used
  const [formData, setFormData] = useState(
    initialState || {
      title: "",
      policyTitle: "",
      firstName: "",
      lastName: "",
      email: "",
      // Include other default values as fallback
      nominees: [{ name: "", relation: "", gender: "", contribution: "" }],
      lifestyle: {
        smoking: { freq: "", quantity: "" },
        drinking: { freq: "", quantity: "" },
        panMasala: { freq: "", quantity: "" },
        others: "",
      },
      additional: { pan: "", aadhar: "", gstNumber: "" },
    }
  );
  const [errors, setErrors] = useState({});

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

      <BasicDetailsSection
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      />

      <BMIDetailsSection formData={formData} setFormData={setFormData} />

      <LifestyleSection formData={formData} setFormData={setFormData} />

      <MedicalHistorySection formData={formData} setFormData={setFormData} />

      <NomineesSection formData={formData} setFormData={setFormData} />

      <AdditionalInfoSection formData={formData} setFormData={setFormData} />

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </Box>
  );
}
