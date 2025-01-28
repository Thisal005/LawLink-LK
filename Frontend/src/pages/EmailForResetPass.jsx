import React, { useState, useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import {  toast } from "react-toastify";
import axios from "axios";

import "../css/CreateAcc.css";

function EmailForResetPass() {
    const [email, setlocalEmail] = useState("");

    const navigate = useNavigate();
    const { backendUrl, setEmail } = useContext(AppContext); 
    

    const handleSubmit = async (e) => {
      e.preventDefault();
     
      axios.defaults.withCredentials = true;
      
        try {
          const response = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, {
            email: email,
          });
        

          if (response.status === 201 || response.status === 200) {
            setEmail(email);
            toast.success("Please check your email for the OTP.");
            navigate("/password-rest");
          } else {
            console.log("Response status is not 201:", response.status);
             toast.error(response.data.msg || "An error occurred. Please try again.");
          }
          
        } catch (err) {
          console.error("Error during reset password:", err);
          toast.error("An error occurred while sending otp. Please try again.");
        }
      };
    

    return (
        <div className="main-container">
          <div className="form-container">
            <h1>Enter Your Email For Password Reset</h1>
            <div className="line"></div>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
    
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setlocalEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
    
              </div>
              <button type="submit" className="submit-btn" >
               Request Otp
              </button>
            </form>
          </div>
        </div>
      );
}

export default EmailForResetPass
