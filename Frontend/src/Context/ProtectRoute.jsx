import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, userData, getUserData } = useContext(AppContext); // Destructure userData here
  const location = useLocation();

  useEffect(() => {
    // Try to get user data if we're logged in but don't have user data
    if (isLoggedIn && !userData) {
      getUserData();
    }
  }, [isLoggedIn, userData, getUserData]); // Add userData as a dependency

  if (!isLoggedIn) {
    // Redirect to login page if not logged in
    // Store the path they were trying to access
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;