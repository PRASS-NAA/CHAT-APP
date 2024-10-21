import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(() => {
        const storedUser = localStorage.getItem("chat-user");
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
            console.error("Invalid JSON in localStorage:", e);
            return null;
        }
    });

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    );
};
