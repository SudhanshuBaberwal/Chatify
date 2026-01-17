import React, { useState } from "react";
import { Search, Command, MoreVertical, Bell, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import setOtherUsers from "../redux/userSlice"
import setUserData from "../redux/userSlice"

const Sidebar = ({ users, selectedUser, onSelect }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const { userData } = useSelector((state) => state.user);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      const result = await axios.get("http://localhost:3000/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null))
      dispatch(setOtherUsers(null))
      navigate("/login")
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="p-6 pb-4 shrink-0 z-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="font-bold text-lg">A</span>
            </div>
            <div>
              <h2 className="font-bold text-lg tracking-tight">Chatify</h2>
              <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">
                Workspace
              </p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full border border-white/5 hover:bg-white/5 flex items-center justify-center transition-all text-white/50 hover:text-white">
            <Bell size={18} />
          </button>
        </div>

        {/* Search Pill */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center bg-[#0a0a0a]/50 border border-white/10 rounded-2xl px-4 py-3.5 transition-all group-focus-within:border-white/20 group-focus-within:bg-[#0a0a0a]/80">
            <Search
              className="text-white/30 group-focus-within:text-indigo-400 transition-colors mr-3"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contacts..."
              className="bg-transparent w-full text-sm text-white placeholder-white/20 focus:outline-none"
            />
            <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/5">
              <Command size={10} className="text-white/30" />
              <span className="text-[10px] text-white/30 font-bold">K</span>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar z-10">
        <div className="px-2 mb-2">
          <span className="text-xs font-semibold text-white/20 uppercase tracking-widest">
            Direct Messages
          </span>
        </div>

        {filtered.map((u) => {
          const isActive = selectedUser?.id === u.id;
          return (
            <div
              key={u.id}
              onClick={() => onSelect(u)}
              className={`
                                group relative p-4 rounded-2xl cursor-pointer transition-all duration-300
                                border border-transparent
                                ${
                                  isActive
                                    ? "bg-white/[0.08] border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.2)]"
                                    : "hover:bg-white/[0.03] hover:border-white/[0.05]"
                                }
                            `}
            >
              {/* Active Neon Glow Bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-r-full shadow-[0_0_15px_#818cf8]" />
              )}

              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={u.avatar}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white/5 group-hover:ring-white/10 transition-all"
                  />
                  <div
                    className={`
                                        absolute bottom-0 right-0 w-3.5 h-3.5 border-[3px] border-[#131313] rounded-full
                                        ${
                                          u.status === "online"
                                            ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                                            : "bg-gray-500"
                                        }
                                    `}
                  ></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3
                      className={`font-semibold text-[15px] ${
                        isActive ? "text-white" : "text-gray-200"
                      }`}
                    >
                      {u.name}
                    </h3>
                    <span
                      className={`text-[11px] ${
                        isActive ? "text-indigo-200" : "text-white/30"
                      }`}
                    >
                      {u.time}
                    </span>
                  </div>
                  <p
                    className={`text-sm truncate ${
                      isActive
                        ? "text-white/80"
                        : "text-white/40 group-hover:text-white/60"
                    } transition-colors`}
                  >
                    {u.msg}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* User Profile Footer */}
      <div className="p-4 mt-auto border-t border-white/5 bg-black/20">
        <div className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 p-[1px]">
              <img
                src={
                  userData.user.image ||
                  `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100`
                }
                className="w-full h-full rounded-full object-cover border border-black"
                alt=""
              />
            </div>
            <div onClick={() => navigate("/profile")} className="flex flex-col">
              <span className="text-sm font-semibold text-white">
                {userData.user.fullname}
              </span>
              <span className="text-[10px] text-emerald-400">Online</span>
            </div>
          </div>
          <LogOut onClick={handleLogout}
            size={16} 
            className="text-white/30 group-hover:text-white"
          />
        </div>
      </div>

      <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 0px; }
            `}</style>
    </div>
  );
};

export default Sidebar;
