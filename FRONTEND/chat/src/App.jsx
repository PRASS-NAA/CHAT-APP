import React, { useEffect } from "react";
import Login from "./pages/login/login";
import SignUp from "./pages/signup/signup";
import { Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./pages/home/homepage";
import Verification from "./pages/signup/emailverification";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";

const App = () => {
  const { authUser, setAuthUser } = useAuthContext();

  useEffect(() => {
    // Clear chat-user from localStorage if required
    localStorage.removeItem("chat-user");
    // Reset auth state to null on initial load
    setAuthUser(null);
  }, [setAuthUser]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route
          path="/homepage"
          element={authUser ? <Homepage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/homepage" /> : <SignUp />}
        />
        <Route
          path="/verification"
          element={authUser ? <Navigate to="/homepage" /> : <Verification />}
        />
        <Route
          path="/"
          element={authUser ? <Navigate to="/homepage" /> : <Login />}
        />
      </Routes>
    </>
  );
};

export default App;
