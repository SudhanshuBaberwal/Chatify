import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import useGetCurrentUser from "./customHooks/getCurrentUser";

const App = () => {
  useGetCurrentUser();
  let { userData } = useSelector((state) => state.user);
  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to="/profile" />}
        />
        <Route
          path="/login"
          element={!userData ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={userData ? <Profile /> : <Navigate to="/signup" />}
        />
      </Routes>
    </>
  );
};

export default App;
