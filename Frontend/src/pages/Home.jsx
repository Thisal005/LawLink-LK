import React, {  useContext } from "react";
import { AppContext } from "../Context/AppContext";

function Home() {
  const {userData } = useContext(AppContext); 
  return (
    <div>
      <h1>Home Page</h1>
      <h2>Hello {userData ? userData.fullName: "htto"}</h2>
      <h2>email : {userData ? userData.email: "htto@gmail.com"}</h2>
      <h2>contact : {userData ? userData.contact: "htto62062"}</h2>
      <form>
     
        <input type="password" placeholder="Enter password" required></input>
        <input type="password" placeholder="Re-enter password" required></input>

      </form>
     

    </div>
  )
}

export default Home
