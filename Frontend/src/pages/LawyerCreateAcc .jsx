import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

import "../css/lawyerCreateAcc.css";

function LawyerCreateAcc() {
  const navigate = useNavigate();
  const { backendUrl, setEmail } = useContext(AppContext);

  const [fullName, setFullname] = useState("");
  const [email, setEmailLocal] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [document, setDocument] = useState("");

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
      setPasswordError(
        "Password must be at least 8 characters long, including uppercase, lowercase, numbers, and symbols."
      );
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

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("contact", contact);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("documentForVerification", document);

    const response = await axios.post(`${backendUrl}/api/lawyer/signup`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 201) {
      setEmail(email);
      toast.success("Account created successfully! Please check your email for the OTP.");
      navigate("/lawyer-verify-email");
    } else {
      toast.error(response.data.msg || "An error occurred. Please try again.");
    }
  } catch (err) {
    console.error("Error during signup:", err);
    toast.error("An error occurred while creating your account. Please try again.");
  }
};
  return (
    <div className="lawyer-createacc-main-container">
      <div className="lawyer-createacc-animation-container">
        <video
          src="images/createacc.mp4"
          autoPlay
          loop
          muted
          className="lawyer-animation-video"
        ></video>
      </div>

      <div className="lawyer-createacc-form-container">
        <h1>Create Account</h1>
        <div className="createacc-line"></div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              className="lawyer-createacc-input"
              type="text"
              value={fullName}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Enter your full name"
              required
            />

            <label>Email</label>
            <input
              className="lawyer-createacc-input"
              type="email"
              value={email}
              onChange={(e) => setEmailLocal(e.target.value)}
              placeholder="Enter your email address"
              required
            />

            <label>Contact Number</label>
            <input
              className="lawyer-createacc-input"
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter your contact number"
              required
            />

            <label>Document For Verification</label>
            <input
              className="lawyer-createacc-input"
              type="file"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={(e) => setDocument(e.target.files[0])}
              required
            />

            <label>Password & Confirm Password</label>
            <div className="lawyer-createacc-password-container">
              <div style={{ position: 'relative', width: '100%', marginBottom: '0px' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="password-container-input"
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <img src="images/close.png" alt="Hide" /> : <img src="images/open.png" alt="Show" />}
                </button>
              </div>

              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                  className="password-container-input"
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <img src="images/close.png" alt="Hide" /> : <img src="images/open.png" alt="Show" />}
                </button>
              </div>
            </div>

            {passwordError && <p className="error">{passwordError}</p>}
            {confirmPasswordError && <p className="error">{confirmPasswordError}</p>}
          </div>

          <button type="submit" className="submit-btn">
            Submit
          </button>
          <div className="below-line"></div>
          <button type="button" className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LawyerCreateAcc;
