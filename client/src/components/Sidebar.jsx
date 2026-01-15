import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Search, MoreVertical, Settings, LogOut } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Sidebar = ({
  contacts = [],
  activeContactId,
  onSelectContact,
  currentUser,
}) => {
  const navigate = useNavigate();
  let { userData } = useSelector((state) => state.user);
  // console.log(userData)

  let [search, setSearch] = useState(false);

  const sidebarRef = useRef(null);
  const listRef = useRef(null);

  // GSAP: Staggered Entrance
  useEffect(() => {
    const items = listRef.current.children;
    gsap.fromTo(
      items,
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power2.out" }
    );
  }, [contacts]);

  // Hover Animation Helper
  const handleMouseEnter = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1.02,
      backgroundColor: "rgba(255,255,255,0.08)",
      duration: 0.3,
    });
  };

  const handleMouseLeave = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      backgroundColor: "transparent",
      duration: 0.3,
    });
  };

  return (
    <div
      ref={sidebarRef}
      className="w-full md:w-[350px] h-full flex flex-col bg-[#0b0c15] border-r border-white/5 relative z-20"
    >
      {/* Header / Current User */}
      <div className="p-6 border-b border-white/5 bg-[#0b0c15]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold tracking-widest text-white">
            Chatify
          </h1>
          <button className="text-gray-400 hover:text-white transition">
            <Settings size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div onClick={() => setSearch(true)} className="relative group">
          <form>
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder="Search encrypted channels..."
              className="w-full bg-[#1a1b26] border border-white/5 text-gray-300 text-sm rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            />
          </form>
        </div>
      </div>

      {/* Contacts List */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar"
      >
        {contacts.map((contact) => (
          <div
            key={contact._id}
            onClick={() => onSelectContact(contact._id)}
            onMouseEnter={
              activeContactId !== contact._id ? handleMouseEnter : null
            }
            onMouseLeave={
              activeContactId !== contact._id ? handleMouseLeave : null
            }
            className={`p-3 rounded-xl flex items-center gap-4 cursor-pointer transition-colors border ${
              activeContactId === contact._id
                ? "bg-indigo-600/10 border-indigo-500/30"
                : "border-transparent"
            }`}
          >
            {/* Avatar */}
            <div className="relative">
              <img
                src={contact.avatar || "https://github.com/shadcn.png"}
                alt=""
                className="w-12 h-12 rounded-full object-cover bg-gray-800"
              />
              {contact.status === "online" && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0b0c15] rounded-full"></span>
              )}
            </div>

            {/* Text Info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3
                  className={`text-sm font-semibold ${
                    activeContactId === contact._id
                      ? "text-white"
                      : "text-gray-300"
                  }`}
                >
                  {contact.name}
                </h3>
                <span className="text-[10px] text-gray-600">
                  {contact.time || "12:00 PM"}
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate mt-1">
                {contact.lastMessage || "No messages yet."}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Panel */}
      <div className="p-4 border-t border-white/5 bg-[#080910]">
        <div className="flex items-center gap-3">
          <img
            onClick={() => navigate("/profile")}
            src={userData.user.image || "https://github.com/shadcn.png"}
            alt=""
            className="w-9 h-9 rounded-full cursor-pointer"
          />
          <div className="flex-1">
            <div
              onClick={() => navigate("/profile")}
              className="cursor-pointer text-sm font-medium text-white"
            >
              {userData.user.fullname || "User"}
            </div>
            <div className="text-[10px] text-emerald-500 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              Online
            </div>
          </div>
          <button className="cursor-pointer text-gray-500 hover:text-red-400  transition">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
            `}</style>
    </div>
  );
};

export default Sidebar;
