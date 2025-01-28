import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";


export const AppContext = createContext(); 

export const AppContentProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL; 
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const[userData,setUserData] = useState(false)
    const [email, setEmail] = useState("");
   

    const getUserData = async () => {
        try {
          const { data } = await axios.get(backendUrl + '/api/user/data', {
            withCredentials: true, 
          });
      
          if (data.success) {
            setUserData(data.userData);
          } else {
            toast.error(data.message || 'Failed to retrieve user data.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('Error fetching user data.');
        }
      };
      

    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        getUserData,
        userData,
        setUserData,
        email,
        setEmail
       
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
