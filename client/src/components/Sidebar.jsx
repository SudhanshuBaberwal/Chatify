import React, { useEffect, useState, useMemo, useRef } from "react";
import { Search, Command, Bell, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import {
  setOtherUsers,
  setSelectedUsers,
  setUserData,
} from "../redux/userSlice";

const IDLE_TIMEOUT = 60000;

const Sidebar = () => {
  const {
    userData,
    otherUsers,
    selectedUsers,
    onlineUsers,
    typingUsers,
    lastSeenMap,
    lastActivityMap,
    socket, 
  } = useSelector((state) => state.user);

  const [search, setSearch] = useState("");
  const [unreadMap, setUnreadMap] = useState({}); // 🔴 Local state for unread badges

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onlineUsersSet = useMemo(() => new Set(onlineUsers || []), [onlineUsers]);
  const typingUsersSet = useMemo(() => new Set(typingUsers || []), [typingUsers]);

  // 🔔 Online Sound
  const notifiedUsers = useRef(new Set());
  const onlineSound = useRef(new Audio("/sounds/online.mp3"));

  useEffect(() => {
    onlineUsers?.forEach((id) => {
      if (!notifiedUsers.current.has(id)) {
        onlineSound.current.play().catch(() => {});
        notifiedUsers.current.add(id);
      }
    });
  }, [onlineUsers]);

  // 🔴 NEW: Handle Unread Messages
  useEffect(() => {
    if (!socket) return;
    const handleMessage = (msg) => {
      // If message is from someone we are NOT currently talking to, increase badge
      if (msg.sender !== selectedUsers?._id) {
        setUnreadMap((prev) => ({
          ...prev,
          [msg.sender]: (prev[msg.sender] || 0) + 1,
        }));
      }
    };
    socket.on("newMessage", handleMessage);
    return () => socket.off("newMessage", handleMessage);
  }, [socket, selectedUsers]);

  // Reset unread count when selecting a user
  const handleSelectUser = (user) => {
    dispatch(setSelectedUsers(user));
    setUnreadMap((prev) => ({ ...prev, [user._id]: 0 }));
  };

  // 🔐 Auth Guard
  useEffect(() => {
    if (!userData) navigate("/login");
  }, [userData, navigate]);

  // 🚪 Logout
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.get("http://localhost:3000/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      dispatch(setSelectedUsers(null));
      toast.success("Logged out");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const getPresence = (userId) => {
    if (onlineUsersSet.has(userId)) {
      const lastActive = lastActivityMap?.[userId];
      if (Date.now() - lastActive > IDLE_TIMEOUT) return "idle";
      return "online";
    }
    return "offline";
  };

  const formatLastSeen = (ts) => {
    if (!ts) return "Offline";
    const mins = Math.floor((Date.now() - ts) / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    return new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 🔍 NEW: Filter users based on search
  const filteredUsers = otherUsers?.users?.filter((u) => 
    u.fullname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full w-full">
      {/* HEADER */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-lg">Chatify</h2>
          <Bell size={18} />
        </div>

        <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-3">
          <Search size={18} className="text-white/30 mr-3" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="bg-transparent w-full outline-none text-sm"
          />
        </div>
      </div>

      {/* USER LIST */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2">
        {filteredUsers?.map((u) => {
          const presence = getPresence(u._id);
          const isTyping = typingUsersSet.has(u._id);
          const unreadCount = unreadMap[u._id] || 0;

          return (
            <div
              key={u._id}
              onClick={() => handleSelectUser(u)} // Updated click handler
              className={`p-4 rounded-xl cursor-pointer transition relative
                ${
                  selectedUsers?._id === u._id
                    ? "bg-white/[0.08]"
                    : "hover:bg-white/[0.04]"
                }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={u.image}
                    className="w-11 h-11 rounded-full object-cover"
                    alt=""
                  />
                  {/* STATUS DOT */}
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black
                      ${
                        presence === "online"
                          ? "bg-emerald-400 animate-pulse"
                          : presence === "idle"
                            ? "bg-yellow-400"
                            : "bg-gray-500"
                      }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold truncate">{u.fullname}</p>
                    {/* 🔴 Unread Badge */}
                    {unreadCount > 0 && (
                      <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>

                  {/* STATUS TEXT */}
                  {isTyping ? (
                    <div className="typing-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                  ) : presence === "online" ? (
                    <p className="text-xs text-emerald-400">Online</p>
                  ) : presence === "idle" ? (
                    <p className="text-xs text-yellow-400">Away</p>
                  ) : (
                    <p className="text-xs text-white/40">
                      {formatLastSeen(lastSeenMap?.[u._id])}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-white/5">
        <div className="flex justify-between items-center">
          <div onClick={() => navigate("/profile")} className="flex items-center gap-3">
            <img
              src={userData?.user?.image}
              className="w-9 h-9 rounded-full cursor-pointer"
              alt=""
            />
            <div>
              <p className="text-sm font-semibold">
                {userData?.user?.fullname}
              </p>
              <p className="text-[10px] text-emerald-400">Online</p>
            </div>
          </div>
          <LogOut
            size={22}
            className="text-white/30 hover:text-red-500 cursor-pointer"
            onClick={handleLogout}
          />
        </div>
      </div>

      <style>{`
        .typing-dots span {
          width: 4px; height: 4px; background: #34d399;
          border-radius: 50%; display: inline-block; margin-right: 2px;
          animation: bounce 1.2s infinite ease-in-out;
        }
        .typing-dots span:nth-child(2){animation-delay:.2s}
        .typing-dots span:nth-child(3){animation-delay:.4s}
        @keyframes bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
      `}</style>
    </div>
  );
};

export default Sidebar;