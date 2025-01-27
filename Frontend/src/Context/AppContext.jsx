import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";


export const AppContext = createContext(); // Create a context object

export const AppContentProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL; // Access environment variable
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Fixed variable name
    const [userData, setUserData] = useState(null);
    const [email, setEmail] = useState(""); // Use `null` for the initial value

    const getUserDate = async () => {
        try{
            const {data} = await axios.get(backendUrl + '/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)

        }catch(error){
            toast.error(data.message)

        }
    }


    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserDate,
        email,
        setEmail
    };


    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
