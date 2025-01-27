import ClientCreateAcc from "./pages/ClientCreateAcc"
import Clientlogin from "./pages/Clientlogin";
import Home from "./pages/Home";
import VerifyEmail from "./pages/Verify-email";
import PasswordRest from "./pages/Password-Rest";
import EmailForResetPass from "./pages/EmailForResetPass";
import Newpassword from "./pages/Newpassword";
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
        <Route path="/email-for-password-reset" element={<EmailForResetPass />} />
        <Route path="/create-new-password" element={<Newpassword/>} />
      </Routes>
      </div>   
  )
}

export default App
