import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { getUserProfile } from '../utills/api';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLawyer, setIsLawyer] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        const userData = await getUserProfile();
        setUser(userData);
        setIsLawyer(userData.role === 'lawyer');
        setLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token');
        setUser(null);
        setIsLawyer(false);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLawyer(false);
  }, []);

  // Login function
  const login = useCallback(async (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsLawyer(userData.role === 'lawyer');
  }, []);

  const value = {
    user,
    isLawyer,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};