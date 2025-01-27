import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";


export const AppContext = createContext(); 

export const AppContentProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL; 
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [email, setEmail] = useState(""); 
    const [fullName, setFullname] = useState("");

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
        getUserDate,
        email,
        setEmail,
        fullName,
        setFullname
    };


    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
