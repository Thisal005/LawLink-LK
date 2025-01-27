import ClientCreateAcc from "./pages/ClientCreateAcc"
import Clientlogin from "./pages/Clientlogin";
import Home from "./pages/Home";
import VerifyEmail from "./pages/Verify-email";
import PasswordRest from "./pages/Password-Rest";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {Routes, Route} from "react-router-dom";

function App() {


  return (
     <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-account" element={<ClientCreateAcc />} />
        <Route path="/login" element={<Clientlogin />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/password-rest" element={<PasswordRest />} />
      </Routes>
      </div>   
  )
}

export default App
