import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../css/Verify-email.css';

function RestPasswordOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, ""); 
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      
      if (value && index < otp.length - 1) {
        e.target.nextSibling?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      e.target.previousSibling?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Submitted OTP: ${otp.join("")}`);
  };

  return (
    <div className="verify-email-main-container">
      <form onSubmit={handleSubmit} className='otp'>
        <h1>Rest Password Otp</h1>
        <div className="otp-line" ></div>
        <label htmlFor="otp" className='otp'> Enter Your One Time Password</label>
        <div className="otp-container">
          {otp.map((_, index) => (
            <input
             
              key={index}
              type="text"
              maxLength="1"
              value={otp[index]}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="otp-box"
            />
          ))}
          
        </div>
        <p className='otp'>Resend OTP</p>

        <button type="submit" className='otp'>Submit</button>
      </form>
      <div className="verify-email-create-account">
           <p className="back-to-signup" onClick={() => navigate("/login")}>Back to  <u><a href="#"><b>Login</b></a></u></p>
        </div>
    </div>
  );
}

export default RestPasswordOtp;
