import React, {  useContext } from "react";
import { AppContext } from "../Context/AppContext";

function Home() {
  const { userData, lawyerData } = useContext(AppContext); 

  return (
    <div>
      <h1>Home Page</h1>
      <h2>Hello {userData?.fullName || lawyerData?.fullName || "Guest"}</h2>
      <h2>Email: {userData?.email || lawyerData?.email || "No email"}</h2>
      <h2>Contact: {userData?.contact || lawyerData?.contact || "No contact"}</h2>
     
    </div>
  );
}

export default Home
