import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import useGetCurrentUser from "./customHooks/getCurrentUser";
import getOtherUsers from "./customHooks/getOtherUsers";
import { io } from "socket.io-client";
import { setOnlineUsers, setSocket } from "./redux/userSlice";
import EmailVerification from "./utils/EmailVerification";
import ForgotPassword from "./utils/ForgotPassword";
import ResetPassword from "./utils/ResetPassword";

const App = () => {
  useGetCurrentUser();
  getOtherUsers();
  let { userData, socket, onlineUsers } = useSelector((state) => state.user);
  let dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      const socketio = io("http://localhost:3000", {
        query: {
          userId: userData?.user._id,
        },
      });
      dispatch(setSocket(socketio));
      socketio.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });
      return () => {
        socketio.close("getOnlineUsers");
      };
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData]);

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
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  );
};

export default App;
