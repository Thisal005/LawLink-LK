import React, {useContext} from 'react'
import { AppContext } from "../Context/AppContext";

function Home() {
  const {userData} = useContext(AppContext);
  return (
    <div>
      <h1>Home Page</h1>
      <p>Hello {userData ? userData.email : htto}</p>

    </div>
  )
}

export default Home
