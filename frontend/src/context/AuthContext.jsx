import React, { createContext, useState, useEffect, useContext } from "react";

// Create the context
const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(null);

	useEffect(() => {
		// Check for JWT token in cookies
		const token = document.cookie.split("; ").find(row => row.startsWith("jwt="))?.split("=")[1];

		if (token) {
			// If token exists, assume user is authenticated
			setAuthUser({ token });
		} else {
			// If no token, set authUser to null
			setAuthUser(null);
		}
	}, []);

	// For logging out, you can clear the token by updating the cookies
	const logout = () => {
		document.cookie = "jwt=; Max-Age=0; path=/"; // This clears the JWT token
		setAuthUser(null);
	};

	return (
		<AuthContext.Provider value={{ authUser, setAuthUser, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook to use the AuthContext
export const useAuthContext = () => useContext(AuthContext);
