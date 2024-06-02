import React, { createContext, useContext, useState} from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const value = {
        currentUser,
        setCurrentUser,
        isLoggedIn,
        setIsLoggedIn
    }

    const logout = () => {
        setCurrentUser(null);
        setIsLoggedIn(false); 
    }

    return (
        <AuthContext.Provider value={ {...value, logout} }>
            {children}
        </AuthContext.Provider>
    );
};

