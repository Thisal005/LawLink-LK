import React, { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, userData, lawyerData, getUserData, getLawyerData, isCheckingAuth } =
    useContext(AppContext);
  const location = useLocation();

  useEffect(() => {
    if (isLoggedIn && !userData && !lawyerData) {
      // Try fetching user data if logged in but no data exists
      if (location.pathname.includes("lawyer")) {
        getLawyerData();
      } else {
        getUserData();
      }
    }
  }, [isLoggedIn, userData, lawyerData, getUserData, getLawyerData, location.pathname]);

  if (isCheckingAuth) {
    // Show a loading state while checking authentication
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    // Redirect to login page if not logged in
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;