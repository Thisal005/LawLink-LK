import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getCookie } from "../utills/cookies";

export const AppContext = createContext(); 


export const AppContentProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL; 
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [userData, setUserData] = useState(null);
    const [lawyerData, setLawyerData] = useState(null);
    const [email, setEmail] = useState("");


 useEffect(() => {
  const checkLoginStatus = async () => {
    try {
      // Check for user login
      try {
        const { data } = await axios.get(backendUrl + '/api/user/data', {
          withCredentials: true
        });
        
        if (data.success) {
          setIsLoggedIn(true);
          setUserData(data.userData);
          return; // If user is logged in, stop here
        }
      } catch (error) {
        // User not logged in, try checking lawyer next
      }
      
      // Check for lawyer login
      try {
        const { data } = await axios.get(backendUrl + '/api/lawyer-data/data', {
          withCredentials: true
        });
        
        if (data.success) {
          setIsLoggedIn(true);
          setLawyerData(data.UserData);
          return;
        }
      } catch (error) {
        // Lawyer not logged in either
      }
      
      // If we reach here, no one is logged in
      setIsLoggedIn(false);
      
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsLoggedIn(false);
    }
  };
  
  checkLoginStatus();
}, [backendUrl]);

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data', {
                withCredentials: true, 
                headers: {
                    Authorization: `Bearer ${getCookie('jwt')}`,
                },
            });
        
            if (data.success) {
                setUserData(data.userData);
            } 
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error('Error fetching user data.');
        }
    };

    const getLawyerData = async () => {
      try {
        const { data } = await axios.get(backendUrl + '/api/lawyer-data/data', {
          withCredentials: true, 
        });
      
        if (data.success) {
          setLawyerData(data.UserData);
        } else {
          toast.error(data.message || 'Failed to retrieve lawyer data.');
        }
      } catch (error) {
        console.error('Error fetching lawyer data:', error);
        toast.error('Error fetching lawyer data.');
      }
    };

    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        getUserData,
        getLawyerData,
        userData,
        setUserData,
        lawyerData,
        setLawyerData,
        email,
        setEmail
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};