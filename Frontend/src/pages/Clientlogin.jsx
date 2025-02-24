import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import "../css/Clientlogin.css";

function Clientlogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl, setIsLoggedIn, getUserData, isLoggedIn } = useContext(AppContext);
  const [email, setEmailLocal] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // If user is already logged in, redirect to home or the page they were trying to access
  useEffect(() => {
    if (isLoggedIn) {
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo, { replace: true });
    }
  }, [isLoggedIn, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      // Ensure credentials (cookies) are included in the request
      axios.defaults.withCredentials = true;
  
      // Send login request to the backend
      const response = await axios.post(backendUrl + '/api/auth/login', {
        email,
        password,
      });
  
      // Check if the login was successful
      if (response.status === 200) {
        console.log("User logged in successfully:", response.data);
  
        // Update the login state
        setIsLoggedIn(true);
  
        // Fetch user data
        await getUserData();
        
        // Redirect to home or the page they were trying to access
        const redirectTo = location.state?.from || "/";
        navigate(redirectTo, { replace: true });
  
        // Show success message
        toast.success("Logged in successfully!");
      }
    } catch (err) {
      console.error("Login error:", err);
  
      // Handle specific error messages from the backend
      if (err.response && err.response.data && err.response.data.msg) {
        toast.error(err.response.data.msg);
      } else {
        toast.error("An error occurred during login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-main-container">
      <div className="login-animation-container">
        <video
          src="images/gtrfe-1.mp4"
          autoPlay
          loop
          muted
          className="login-animation-video"
        ></video>
      </div>
    
      <div className="login-form-container">
        <h1>Log in to your account</h1>
        <div className="login-line"></div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              className="login-input"
              type="email"
              value={email}
              onChange={(e) => setEmailLocal(e.target.value)}
              placeholder="Enter your email address"
              required
            />

            <label>Password</label>
            <div className="login-password-container">
              <input
                className="password-container-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="login-toggle-password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <img src="images/close.png" alt="Hide password"/> : <img src="images/open.png" alt="Show password"/>}
              </button>
            </div>
            <p className="forgot-password" onClick={() => navigate("/email-for-password-reset")}><a href="#">Forgot Password?</a></p>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Submit"}
          </button>
        </form>
        <div className="create-account">
          <p onClick={() => navigate("/create-account")}>Don't have an account? <u><a href="#"><b>Sign up now</b></a></u></p>
        </div>
      </div>
    </div>
  );
}

export default Clientlogin;