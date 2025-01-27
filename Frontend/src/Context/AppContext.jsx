import { createContext, useState } from "react";


export const AppContext = createContext(); // Create a context object

export const AppContentProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL; // Access environment variable
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Fixed variable name
    const [user, setUser] = useState(null); // Use `null` for the initial value

    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
    };

    
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
