import ClientCreateAcc from "./pages/ClientCreateAcc"
import Clientlogin from "./pages/Clientlogin";
import Home from "./pages/Home";
import VerifyEmail from "./pages/Verify-email";
import PasswordRest from "./pages/Password-Rest";
import EmailForResetPass from "./pages/EmailForResetPass";
import Newpassword from "./pages/Newpassword";
import LawyerCreateAcc from "./pages/LawyerCreateAcc ";
import LawyerVerifyEmail from "./pages/Lawyer-verify-email ";
import Lawyerlogin from "./pages/Lawyerlogin";
import LawyerEmailForResetPass from "./pages/LawyerEmailForResetPass";
import LawyerNewpassword from "./pages/LawyerNewpassword";
import LawyerRestPasswordOtp from "./pages/LawyerPassword-Rest ";
import Chat from "./pages/Chat";
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
        <Route path="/lawyer-create-account" element={<LawyerCreateAcc />} />
        <Route path="/lawyer-verify-email" element={<LawyerVerifyEmail />} />
        <Route path="/lawyer-login" element={<Lawyerlogin />} />
        <Route path="/lawyer-email-for-password-reset" element={<LawyerEmailForResetPass />} />
        <Route path="/lawyer-create-new-password" element={<LawyerNewpassword />} />
        <Route path="/lawyer-password-rest" element={<LawyerRestPasswordOtp />} />   
        <Route path="/chat" element={<Chat />} />
        
      </Routes>
      </div>   
  )
}

export default App
