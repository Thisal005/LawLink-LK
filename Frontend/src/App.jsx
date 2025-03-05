import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./Context/ProtectRoute";
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
import LawyerDasgboard from "./pages/LawyerDasgboard";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Case from "./pages/Case";
import Notifications from "./pages/Notifications";
import { ToastContainer } from "react-toastify";
import { AppContentProvider } from "./Context/AppContext";
import { AuthContextProvider,useAuthContext } from "./Context/AuthContext";
import { SocketProvider } from "./Context/SocketContext";
import "react-toastify/dist/ReactToastify.css";




function App() {
  return (

    <AuthContextProvider>
      <AppContentProvider>
      <SocketProvider>
        <div>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
            <Route path="/lawyer-dashboard" element={<ProtectedRoute><LawyerDasgboard/></ProtectedRoute>} />
            <Route path="/create-account" element={<ClientCreateAcc />} />
            <Route path="/login" element={<Clientlogin />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/password-rest" element={<PasswordRest />} />
            <Route path="/email-for-password-reset" element={<EmailForResetPass />} />
            <Route path="/create-new-password" element={<Newpassword />} />
            <Route path="/lawyer-create-account" element={<LawyerCreateAcc />} />
            <Route path="/lawyer-verify-email" element={<LawyerVerifyEmail />} />
            <Route path="/lawyer-login" element={<Lawyerlogin />} />
            <Route path="/lawyer-email-for-password-reset" element={<LawyerEmailForResetPass />} />
            <Route path="/lawyer-create-new-password" element={<LawyerNewpassword />} />
            <Route path="/lawyer-password-rest" element={<LawyerRestPasswordOtp />} />
            <Route path="/chat" element={<ProtectedRoute><Chat/></ProtectedRoute>} />
            <Route path="/case" element={<ProtectedRoute><Case/></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications/></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
    </SocketProvider>

      </AppContentProvider>
    </AuthContextProvider>
  );
}

export default App