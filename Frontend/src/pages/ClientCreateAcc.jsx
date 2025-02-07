import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import "../css/lawyerCreateAcc.css";

function LawyerCreateAcc() {
  const navigate = useNavigate();
  const { backendUrl, setEmail } = useContext(AppContext);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    document: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

    return strength;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.contact.trim()) newErrors.contact = "Contact number is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required.";
    if (!formData.document) newErrors.document = "Document is required.";

    if (formData.password && !calculatePasswordStrength(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long, including uppercase, lowercase, numbers, and symbols.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
  
    try {
      let hasError = false;
  
      if (!calculatePasswordStrength(password)) {
        setPasswordError("Password must be at least 8 characters long, including uppercase, lowercase, numbers, and symbols.");
        hasError = true;
      } else {
        setPasswordError(null);
      }
  
      if (password !== confirmPassword) {
        setShowConfirmPassword("Passwords do not match. Please try again.");
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "password") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
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

  return (
    <div className="main-container">
      <div className="animation-container">
        <div className="text-white text-center">
          <h2>Welcome to LawLink LK</h2>
          <p>Join our network of legal professionals</p>
        </div>
        <div className="video-container">
          <video src="images/gtrfe.mp4" autoPlay loop muted className="animation-video"></video>
        </div>
        <div className="logo-container">
          <img src="images/logo.png" alt="Logo" className="logo" />
        </div>
      </div>

      <div className="form-container">
        <h1>Create Account</h1>
        <div className="line"></div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              className="normal-input"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              style={{ width: "96%" }}
            />
            {errors.fullName && <p className="error">{errors.fullName}</p>}

            {/* Two-Column Layout for Email and Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <label>Email</label>
                <input
                  className="w-full px-4 py-2 border rounded-md"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>

              <div>
                <label>Contact Number</label>
                <input
                  className="w-full px-3 py- border rounded-md"
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Enter your contact number"
                  required
                />
                {errors.contact && <p className="error">{errors.contact}</p>}
              </div>
            </div>

            <div className="passwords">
              <div className="password-input-wrapper" >
                <label>Password</label>
                <div className="password-input-container" style={{ width: "102%" }}>
                  <input
                    className="input"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    placeholder="Enter password"
                    required
                    style={{ width: "95%" }}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <img src="images/close.png" alt="Hide" /> : <img src="images/open.png" alt="Show" />}
                  </button>
                </div>
              </div>

              <div className="password-input-wrapper">
                <label>Confirm Password</label>
                <div className="password-input-container" style={{ width: "102%" }}>
                  <input
                    className="input"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <img src="images/close.png" alt="Hide" /> : <img src="images/open.png" alt="Show" />}
                  </button>
                </div>
              </div>
            </div>

            {(isPasswordFocused || formData.password) && (
              <>
                <div className="password-strength-text">
                  Password Strength: {["Weak", "Fair", "Good", "Strong", "Very Strong"][passwordStrength - 1]}
                </div>
                <div className="password-strength-container">
                  <div
                    className="password-strength-bar"
                    style={{ width: `${(passwordStrength / 5) * 100}%`, backgroundColor: getPasswordStrengthColor() }}
                  ></div>
                </div>
              </>
            )}

            {formData.password !== formData.confirmPassword && formData.confirmPassword && (
              <p className="error" style={{ alignItems: "center" }}>Passwords do not match.</p>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        <div className="login">
          <p onClick={() => navigate("/lawyer-login")}>
            Already have an account? <u><a href="#"><b>Login</b></a></u>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LawyerCreateAcc;