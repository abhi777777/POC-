// components/UpdateForm.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import FileUploadSection from "./FileUploadSection";

const UpdateForm = ({ onSubmit, loading }) => {
  // Define the available update fields
  const updateFields = [
    {
      label: "New Name",
      name: "newName",
      key: "name",
      description: "Update your name as it appears on your account",
    },
    {
      label: "New Address",
      name: "newAddress",
      key: "address",
      description: "Update your current residence address",
    },
    {
      label: "New Phone Number",
      name: "newPhoneNumber",
      key: "phone",
      inputProps: { maxLength: 10 },
      description: "Update your contact phone number",
    },
  ];

  // State for form data
  const [formData, setFormData] = useState({
    newName: "",
    newAddress: "",
    newPhoneNumber: "",
  });

  // State for selected updates
  const [selectedUpdates, setSelectedUpdates] = useState({
    name: false,
    address: false,
    phone: false,
  });

  // State for file uploads
  const [fileUrls, setFileUrls] = useState({
    name: "",
    address: "",
    phone: "",
  });

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedUpdates((prev) => ({ ...prev, [name]: checked }));

    // Clear the field value if unchecked
    if (!checked) {
      const fieldName = updateFields.find((field) => field.key === name)?.name;
      if (fieldName) {
        setFormData((prev) => ({ ...prev, [fieldName]: "" }));
        setFileUrls((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  // Handle file upload for a specific field
  const handleFileUpload = (key, url) => {
    setFileUrls((prev) => ({ ...prev, [key]: url }));
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    for (const field of updateFields) {
      const { key, name } = field;
      if (selectedUpdates[key]) {
        // Check if the field has a value and a corresponding file
        if (!formData[name] || !fileUrls[key]) {
          return false;
        }
      }
    }
    // Check if at least one update is selected
    return Object.values(selectedUpdates).some((selected) => selected);
  };

  // Submit the form
  const handleSubmit = async () => {
    if (!isFormValid()) return;

    const updates = {};

    updateFields.forEach((field) => {
      if (selectedUpdates[field.key]) {
        updates[field.name] = formData[field.name];
        updates[`${field.key}ProofUrl`] = fileUrls[field.key];
      }
    });

    await onSubmit(updates);
  };

  return (
    <Box component={Paper} sx={{ p: 2, mb: 2 }}>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Select the information you want to update and provide the required proof
        documents.
      </Typography>

      <Grid container spacing={3}>
        {updateFields.map((field) => (
          <Grid item xs={12} key={field.key}>
            <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 1, p: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedUpdates[field.key]}
                    onChange={handleCheckboxChange}
                    name={field.key}
                  />
                }
                label={
                  <Typography variant="subtitle1">{field.label}</Typography>
                }
              />

              {selectedUpdates[field.key] && (
                <Box sx={{ mt: 1.5 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {field.description}
                  </Typography>

                  <TextField
                    fullWidth
                    label={field.label}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    inputProps={field.inputProps}
                    sx={{ mb: 2 }}
                  />

                  <FileUploadSection
                    label={`Upload proof for ${field.label}`}
                    fieldKey={field.key}
                    fileUrl={fileUrls[field.key]}
                    onFileUpload={handleFileUpload}
                  />
                </Box>
              )}
            </Box>
          </Grid>
        ))}

        <Grid item xs={12} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={!isFormValid() || loading}
            startIcon={
              loading && <CircularProgress size={20} color="inherit" />
            }
          >
            {loading ? "Submitting..." : "Submit Updates"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UpdateForm;
