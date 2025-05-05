// components/FileUploadSection.jsx
import React, { useRef } from "react";
import { Box, Button, Typography, Link } from "@mui/material";
import { toast } from "react-toastify";
import { createUploadWidget } from "./cloudinaryService";

const FileUploadSection = ({ label, fieldKey, fileUrl, onFileUpload }) => {
  const widgetRef = useRef();

  // Initialize and open Cloudinary upload widget
  const openUploadWidget = () => {
    if (!widgetRef.current) {
      widgetRef.current = createUploadWidget(
        (url) => {
          onFileUpload(fieldKey, url);
          toast.success("Document uploaded successfully");
        },
        (err) => {
          console.error("File upload failed:", err);
          toast.error("File upload failed. Please try again.");
        }
      );
    }
    widgetRef.current.open();
  };

  return (
    <Box>
      <Button
        variant="outlined"
        fullWidth
        onClick={openUploadWidget}
        sx={{ mb: 1 }}
      >
        {fileUrl ? "Change Document" : label}
      </Button>

      {fileUrl && (
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            Document uploaded:
          </Typography>
          <Link
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              fontSize: "0.875rem",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            View Document
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default FileUploadSection;
