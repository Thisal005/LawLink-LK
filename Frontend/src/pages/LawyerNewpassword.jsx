import React, { useState, useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import "../css/newPassword.css";

function Newpassword() {
  const navigate = useNavigate();
  const { backendUrl, email } = useContext(AppContext);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

    return strength;
  };

  // Add missing isPasswordStrong function
  const isPasswordStrong = (password) => {
    return calculatePasswordStrength(password) >= 4;
  };

  // Update password strength when password changes
  React.useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      if (!email) {
        toast.error("Email is not available. Please start the reset process again.");
        navigate('/email-reset-password');
        return;
      }

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

      const response = await axios.post(`${backendUrl}/api/lawyer/new-password`, {
        email: email,
        newPassword: password
      });

      if (response.status === 200) {
        toast.success("Password reset successfully!");
        navigate("/login");
      }
    } catch (err) {
      console.error("Error during password reset:", err);
      toast.error(err.response?.data?.msg || "Failed to reset password.");
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "red";
      case 2:
      case 3:
        return "orange";
      case 4:
      case 5:
        return "green";
      default:
        return "red";
    }
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "";
    const strengthTexts = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
    return strengthTexts[passwordStrength - 1];
  };

  return (
    <div className="new-password-main-container">
    <div className="new-password-form-container"> 
      <h1>Create New Password</h1>
      <div className="new-password-underline"></div>  
      <form onSubmit={handleSubmit}>
          <div className="input-group">
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
                className="new-toggle-password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <img src="images/close.png" alt="Hide password" />
                ) : (
                  <img src="images/open.png" alt="Show password" />
                )}
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
                className="new-toggle-password-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? (
                  <img src="images/close.png" alt="Hide password" />
                ) : (
                  <img src="images/open.png" alt="Show password" />
                )}
              </button>
            </div>
            {confirmPasswordError && <p className="error">{confirmPasswordError}</p>}
          </div>

          {password && (
            <>
              <div className="password-strength-text">
                Password Strength: {getPasswordStrengthText()}
              </div>
              <div className="password-strength-container">
                <div
                  className="password-strength-bar"
                  style={{ width: `${(passwordStrength / 5) * 100}%`, backgroundColor: getPasswordStrengthColor() }}
                ></div>
              </div>
            </>
          )}

          {password !== confirmPassword && confirmPassword && (
            <p className="error">Passwords do not match.</p>
          )}

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Newpassword;