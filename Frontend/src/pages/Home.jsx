import React, {  useContext } from "react";
import { AppContext } from "../Context/AppContext";

function Home() {
  const { email} = useContext(AppContext); 
  return (
    <div>
      <h1>Home Page</h1>
      <h2>Hello {email}</h2>
     

    </div>
  )
}

export default Home
