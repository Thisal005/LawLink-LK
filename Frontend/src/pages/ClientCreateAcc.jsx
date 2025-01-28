import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import {  toast } from "react-toastify";

import "../css/CreateAcc.css";

function ClientCreateAcc() {

  const navigate = useNavigate();

  const { backendUrl,  setEmail } = useContext(AppContext); 


  const [fullName, setFullname] = useState("");
  const [email, setEmailLocal] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const isPasswordStrong = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) && 
      /[a-z]/.test(password) &&
      /\d/.test(password) && 
      /[!@#$%^&*(),.?":{}|<>]/.test(password) 
    );
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
  
    try {
      let hasError = false;
  
      if (!isPasswordStrong(password)) {
        setPasswordError("Password must be at least 8 characters long, including uppercase, lowercase, numbers, and symbols.");
        hasError = true;
      } else {
        setPasswordError(null);
      }
  
      if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match. Please try again.");
        hasError = true;
      } else {
        setConfirmPasswordError(null);
      }
  
      if (hasError) return;

      const response = await axios.post(`${backendUrl}/api/auth/signup`, {
        fullName,
        email: email,
        contact,
        password,
        confirmPassword,
      });
  
      if (response.status === 201) {
        setEmail(email); 
        toast.success("Account created successfully! Please check your email for the OTP.");
        navigate("/verify-email");
      }
      
      else {
        toast.error(response.data.msg || "An error occurred. Please try again.");
       
      }
    } catch (err) {
      console.error("Error during signup:", err);
      toast.error("An error occurred while creating your account. Please try again.");
    }
  };
  

  return (
    <div className="main-container">
      <div className="animation-container">
        <video
          src="images/createacc.mp4"
          autoPlay
          loop
          muted
          className="animation-video"
        ></video>
      </div>

      <div className="form-container">
        <h1>Create Account</h1>
        <div className="line"></div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Enter your full name"
              required
            />

            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmailLocal(e.target.value)}
              placeholder="Enter your email address"
              required
            />

            <label>Contact Number</label>
            <input
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter your contact number"
              required
            />

            <label>Password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <img src="images/close.png" /> : <img src="images/open.png" />}
              </button>
            </div>
            {passwordError && <p className="error">{passwordError}</p>}

            <label>Confirm Password</label>
            <div className="password-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <img src="images/close.png" /> : <img src="images/open.png" />}
              </button>
            </div>
            {confirmPasswordError && <p className="error">{confirmPasswordError}</p>}
          </div>

          <button type="submit" className="submit-btn" >
            Submit
          </button>
        </form>
        <div className="or">OR</div>
        <button className="google-btn">
          <img src="images/icons8-google-48.png" alt="Google Logo" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default ClientCreateAcc;
