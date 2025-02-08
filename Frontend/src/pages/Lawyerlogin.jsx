import React, { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import {  toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";
import axios from "axios";

import "../css/Clientlogin.css";


function Lawyerlogin() {

  const navigate = useNavigate();
  const {backendUrl, setIsLoggedIn, getLawyerData} = useContext(AppContext);
  const [email, setEmailLocal] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
 

  const handleSubmit = async (e) => {
    try { 
      e.preventDefault();
      axios.defaults.withCredentials = true;
    

    const lawyerData =await axios.post(backendUrl + '/api/lawyer/login',
      { email, password})
    console.log("User Logged in", );

    if (lawyerData.status === 200) {
      setIsLoggedIn(true);
    
      setTimeout(() => {
        getLawyerData();
        navigate("/");
      }, 500);

    }else{
        toast.error(userData.data.msg);
     
    }
  }
    catch(err){
      console.log(err);
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
          className="animation-video"
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
                placeholder="Enter you password"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <img src="images/close.png"/> : <img src="images/open.png"/>}
              </button>
            </div>
            <p className="forgot-password" onClick={() => navigate("/lawyer-email-for-password-reset")}><a href="#">Forgot Password ? </a></p>
          </div>

          <button  type="submit" className="submit-btn">
            Submit
          </button>
        </form>
        <div className="create-account">
            <p className="create-account" onClick={() => navigate("/lawyer-create-account")}>Don't have an account ? <u><a href="#"><b>Sign up now</b></a></u></p>
        </div>
      </div>
    </div>
  );
}

export default Lawyerlogin;
