import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import "../css/Verify-email.css";

function VerifyEmail() {
  const navigate = useNavigate();
  const { email, backendUrl } = useContext(AppContext); 

  const [otp, setOtp] = useState(new Array(6).fill("")); 
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  
    if (value && index < otp.length - 1) {
      e.target.nextSibling?.focus(); // Move to next input
    } else if (!value && index > 0) {
      e.target.previousSibling?.focus(); // Move to previous input
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
  
    console.log("Email:", email);
    console.log("OTP:", otp.join(""));
  
    try {
      console.log("Before Axios call...");
      const response = await axios.post(`${backendUrl}/api/auth/verify-email`, {
        email: email,
        otp:otp.join(""), 
      });
      console.log("After Axios call...", response);
  
      if (response.status === 200 || response.status === 201) {
        toast.success("Account verified successfully!");
        navigate("/login");
      } else {
        console.log("Unexpected response status:", response.status);
        toast.error(response.data.msg || "An error occurred. Please try again.");
      }
    } catch (err) {
     
      console.error("Verification error:", err);
      toast.error("Failed to verify your account. Please try again.");
    }
  };

  const startResendTimer = () => {
    setIsResendDisabled(true);
    setResendTimer(120); 
    
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (isResendDisabled) return;
    
    try {
      const response = await axios.post(`${backendUrl}/api/auth/verify-otp`, {
        email: email,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("New OTP sent! Please check your email.");
        setOtp(new Array(6).fill("")); 
        startResendTimer();
      } else {
        toast.error(response.data.msg || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error resending OTP:", err);
      toast.error("Failed to send OTP. Please try again.");
    }
  };
  

  return (
    <div className="verify-email-main-container">
      <form onSubmit={handleSubmit} className="otp">
        <h1>Verify Email</h1>
        <div className="otp-line"></div>
        <label htmlFor="otp" className="otp">
          Enter the One Time Password sent to your email: <b>{email}</b>
        </label>
        <div className="otp-container">
          {otp.map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={otp[index]}
              onChange={(e) => handleChange(e, index)}
              className="otp-box"
            />
          ))}
        </div>
        <button 
          type="button" 
          onClick={handleResend} 
          className={`resend-button ${isResendDisabled ? 'disabled' : ''}`}
          disabled={isResendDisabled}
        >
          {isResendDisabled 
            ? `Resend OTP in ${resendTimer}s` 
            : 'Resend OTP'}
        </button>

        <button type="submit" className="otp">
          Submit
        </button>
      </form>
    </div>
  );
}

export default VerifyEmail;