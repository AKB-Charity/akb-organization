import React, { useState, useEffect } from "react";
import img1 from "../assets/fundraising.png";
import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router";
import api from "../api.js";
import { Link } from "react-router-dom";
import { LoadingContext } from "../components/CustomComponent/Context.jsx";
import { useContext } from "react";

const VerifierSignIn = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {setLoading} = useContext(LoadingContext);

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  useEffect(() => {
    const storedPhoneNumber = localStorage.getItem("phoneNumber");
    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber);
      setRememberMe(true);
    }
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);

    if (!phoneNumber || !password) {
      setError("Please fill in all fields");
      return;
    }

    const data = {
      phone_number: phoneNumber,
      password: password,
    };
    try {
      setLoading(true);
      const response = await api.post("/api/login_organization/", data);
      setLoading(false);

      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      if (rememberMe) {
        // If "Remember Me" is checked, store phone number in localStorage
        localStorage.setItem("phoneNumber", phoneNumber);
      } else {
        localStorage.removeItem("phoneNumber");
      }

      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/organization/home");
      }, 1500);
      console.log("Sign in successful");
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error.response || error);
      setError(
        error.response?.data?.message ||
          "Invalid login credentials. Please try again."
      );
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-white p-4 lg:gap-16">
      {/* img part */}
      <div className="w-full lg:w-1/3 p-4">
        <img src={img1} alt="fundraising img" className="w-full h-auto" />
      </div>

      {/* right */}
      <div className="w-full lg:w-1/3 p-8 bg-white rounded-lg shadow-xl mt-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          Welcome back
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <p className="mb-4 text-gray-600 text-center">
          Enter your credentials to log in
        </p>

        <form className="space-y-4">
          <TextField
            fullWidth
            label="Phone Number"
            variant="outlined"
            type="tel"
            className="mb-4"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"} // Switch type
            className="mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <div className="flex justify-between items-center mb-4">
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
              }
              label="Remember me"
            />
            <Link to="/">
              <span className="underline hover:text-blue-600">
                Forgot password?
              </span>
            </Link>
          </div>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            className="mb-4 h-12 font-extrabold rounded-lg"
            onClick={handleSignIn}
          >
            Sign In
          </Button>

          <div className="flex items-center justify-center mb-4">
            <span className="text-gray-400 mx-2">or</span>
          </div>

          <Button fullWidth className="h-12 rounded-md bg-blue-">
            <img
              src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
              className="h-4 w-4 "
            />
            <span className="text-black font-semibold ml-3">
              Sign in with Google
            </span>
          </Button>

          <p className="text-left mt-6 text-gray-600 font-semibold text-center text-sm">
            Don’t have an account?
          </p>
        </form>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Sign in successful!
        </Alert>
      </Snackbar>
    </div>
  );
};
export default VerifierSignIn;
