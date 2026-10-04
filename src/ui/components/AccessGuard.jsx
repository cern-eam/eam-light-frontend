import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import KeyIcon from "@mui/icons-material/Key";
import { DEMO_PASSKEY } from "../../config";

const AUTH_STORAGE_KEY = "eam_demo_auth";

export const AccessGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
  });
  const [passkeyInput, setPasskeyInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) return;

    // Check query parameters (?passkey=... or ?access=...)
    const params = new URLSearchParams(window.location.search);
    const passkeyParam = params.get("passkey") || params.get("access");

    if (passkeyParam && passkeyParam.trim() === DEMO_PASSKEY.trim()) {
      localStorage.setItem(AUTH_STORAGE_KEY, "true");
      setIsAuthenticated(true);

      // Clean the URL without reloading
      const url = new URL(window.location.href);
      url.searchParams.delete("passkey");
      url.searchParams.delete("access");
      window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
    }
  }, [isAuthenticated]);

  const handleValidation = (val) => {
    const candidate = (val !== undefined ? val : passkeyInput).trim();
    if (candidate === DEMO_PASSKEY.trim()) {
      localStorage.setItem(AUTH_STORAGE_KEY, "true");
      setIsAuthenticated(true);
      setErrorMessage("");
    } else {
      setErrorMessage("Invalid access code. Please check your invitation or contact your administrator.");
    }
  };

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const formInput = document.getElementById("passkey-input")?.value;
    handleValidation(formInput || passkeyInput);
  };

  if (isAuthenticated) {
    return children;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f6f8",
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 440,
          width: "100%",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
          borderRadius: 3,
          p: 1,
        }}
      >
        <CardContent sx={{ p: 3, textAlign: "center" }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: "rgba(224, 60, 49, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px auto",
              color: "#e03c31",
            }}
          >
            <LockOutlinedIcon fontSize="large" />
          </Box>

          <Typography variant="h5" component="h1" fontWeight={700} gutterBottom sx={{ color: "#1c2536" }}>
            EAM Light Preview
          </Typography>

          <Typography variant="body2" sx={{ color: "#637381", mb: 3 }}>
            This preview environment is invite-only. Please use your invitation link or enter the access code below.
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2, textAlign: "left" }}>
              {errorMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              id="passkey-input"
              name="passkey"
              fullWidth
              size="medium"
              type="password"
              placeholder="Enter access code"
              value={passkeyInput}
              onChange={(e) => {
                setPasskeyInput(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon sx={{ color: "#919eab" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5 }}
              autoFocus
            />

            <Button
              id="passkey-submit-button"
              type="button"
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              size="large"
              sx={{
                py: 1.25,
                backgroundColor: "#e03c31",
                "&:hover": {
                  backgroundColor: "#c52f25",
                },
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              Enter Preview
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AccessGuard;
