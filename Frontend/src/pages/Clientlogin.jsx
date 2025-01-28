import React, { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import {  toast } from "react-toastify";
import { AppContext } from "../Context/AppContext";
import axios from "axios";

import "../css/Clientlogin.css";


function Clientlogin() {

  const navigate = useNavigate();
  const {backendUrl, setIsLoggedIn, getUserData} = useContext(AppContext);
  const [email, setEmailLocal] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
 

  const handleSubmit = async (e) => {
    try { 
      e.preventDefault();
      axios.defaults.withCredentials = true;
    

    const userData =await axios.post(backendUrl + '/api/auth/login',
      { email, password})
    console.log("User Logged in", );

    if (userData.status === 200) {
      setIsLoggedIn(true);
    
      setTimeout(() => {
        getUserData();
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
    
    <div className="main-container">

      <div className="animation-container">
        <video
          src="images/login.mp4"
          autoPlay
          loop
          muted
          className="animation-video"
        ></video>
      </div>

    
      <div className="form-container">
        <h1>Log in to your account</h1>
        <div className="line"></div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
           
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmailLocal(e.target.value)}
              placeholder="Enter your email address"
              required
            />


            <label>Password</label>
            <div className="password-container">
              <input
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
            <p className="forgot-password" onClick={() => navigate("/email-for-password-reset")}><a href="#">Forgot Password ? </a></p>
          </div>

          <button  type="submit" className="submit-btn">
            Submit
          </button>
        </form>
        <div className="create-account">
            <p className="create-account" onClick={() => navigate("/create-account")}>Don't have an account ? <u><a href="#"><b>Sign up now</b></a></u></p>
        </div>
      </div>
    </div>
  );
}

export default Clientlogin;
