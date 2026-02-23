import axios from "axios";
import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo,
} from "react";
import { gsap } from "gsap";
import {
  Send,
  Smile,
  ArrowLeft,
  Phone,
  Video,
  Mic,
  Image as ImageIcon,
  X,
  MessageSquare,
  Zap,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import { setMessages } from "../redux/message.Slice";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";

const IDLE_TIMEOUT = 60000;

const MessageArea = ({ onBack }) => {
  const {
    selectedUsers,
    userData,
    socket,
    onlineUsers,
    typingUsers,
    lastSeenMap,
    lastActivityMap,
  } = useSelector((state) => state.user);

  const { messages } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const pickerRef = useRef(null);

  // 🟢 NEW: Typing Timeout Ref
  const typingTimeoutRef = useRef(null);

  const onlineSet = useMemo(() => new Set(onlineUsers || []), [onlineUsers]);
  const typingSet = useMemo(() => new Set(typingUsers || []), [typingUsers]);

  if (!userData?.user?._id) {
    return (
      <div className="flex flex-1 items-center justify-center text-white/40">
        Loading chat...
      </div>
    );
  }

  const getStatusText = () => {
    if (!selectedUsers) return "Active Now";
    if (typingSet.has(selectedUsers._id)) return "typing...";
    if (onlineSet.has(selectedUsers._id)) {
      const lastActive = lastActivityMap?.[selectedUsers._id] || Date.now();
      if (Date.now() - lastActive > IDLE_TIMEOUT) return "Away";
      return "Active Now";
    }
    const lastSeen = lastSeenMap?.[selectedUsers._id];
    if (!lastSeen) return "Offline";
    const mins = Math.floor((Date.now() - lastSeen) / 60000);
    if (mins < 1) return "Last seen just now";
    if (mins < 60) return `Last seen ${mins} min ago`;
    return "Offline";
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setFrontendImage(null);
    setBackendImage(null);
  };

  // 🟢 NEW: Handle Input + Typing Events
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);

    if (socket && selectedUsers) {
      socket.emit("typing", selectedUsers._id);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", selectedUsers._id);
      }, 2000);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() && !frontendImage) return;

    // 🟢 Stop typing immediately when sending
    if (socket && selectedUsers) socket.emit("stopTyping", selectedUsers._id);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    setInput("");
    setShowPicker(false);
    clearImage();

    try {
      const formData = new FormData();
      formData.append("message", input);
      if (backendImage) formData.append("image", backendImage);

      const res = await axios.post(
        `http://localhost:3000/api/message/send/${selectedUsers._id}`,
        formData,
        { withCredentials: true },
      );

      dispatch(
        setMessages([...(messages || []), res.data.message ?? res.data]),
      );
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  // 🔴 RESTORED: Original Socket Receive Logic
  useEffect(() => {
    socket?.on("newMessage", (msg) => {
      dispatch(setMessages([...(messages || []), msg]));
    });
    return () => socket?.off("newMessage");
  }, [messages, socket, dispatch]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useLayoutEffect(() => {
    if (!selectedUsers) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".chat-bubble",
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [selectedUsers]);
  if (!selectedUsers) {
    return (
      <div
        ref={containerRef}
        className="flex flex-1 min-h-full flex-col items-center justify-center relative overflow-hidden bg-[#050505]"
      >
        {/* Background gradients */}
        <div className="absolute top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-indigo-600/10 rounded-full blur-[120px]" />

        <div className="relative z-10 flex flex-col items-center px-4 translate-y-6 md:translate-y-0">
          {/* Icon cluster */}
          <div className="relative w-44 h-44 md:w-64 md:h-64 mb-8 md:mb-10 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-white/5 border-dashed opacity-30" />
            <div className="absolute w-24 h-24 md:w-32 md:h-32 bg-indigo-500/30 rounded-full blur-2xl" />

            <div className="relative z-20 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-12">
              <MessageSquare size={36} className="text-white" />
            </div>

            <div className="absolute -left-4 md:-left-12 top-8 bg-[#1a1a1a] border border-white/10 p-3 rounded-2xl shadow-xl">
              <span className="text-2xl">👋</span>
            </div>

            <div className="absolute -right-6 md:-right-16 bottom-10 md:bottom-20 bg-[#1a1a1a] border border-white/10 px-4 py-2 rounded-2xl shadow-xl">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100" />
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>

            <div className="absolute right-0 -top-6 bg-white/5 border border-white/10 p-2 rounded-xl">
              <Zap size={18} className="text-yellow-400" />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              Chatify
            </span>
          </h2>

          <p className="text-white/40 max-w-xs md:max-w-sm text-center">
            Select a conversation to start chatting.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full w-full relative bg-[#050505] md:bg-transparent">
      {/* HEADER */}
      <div className="h-16 md:h-20 px-4 md:px-6 flex items-center justify-between border-b border-white/5 bg-white/[0.01] backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <button
            onClick={onBack}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-full text-white/70 -ml-2"
          >
            <ArrowLeft size={20} />
          </button>
          <img
            src={selectedUsers.image}
            className="w-9 h-9 md:w-11 md:h-11 rounded-full object-cover ring-2 ring-white/10"
            alt=""
          />
          <div className="min-w-0">
            <h3 className="font-bold text-white truncate">
              {selectedUsers.fullname}
            </h3>
            <p className="text-xs text-indigo-300 opacity-80 truncate">
              {getStatusText()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50">
            <Phone size={18} />
          </button>
          <button className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50">
            <Video size={18} />
          </button>
        </div>
      </div>

      {/* CHAT AREA */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar"
      >
        {messages?.map((msg) =>
          msg.sender === userData.user._id ? (
            <SenderMessage key={msg._id} msg={msg.message} image={msg.image} />
          ) : (
            <ReceiverMessage
              key={msg._id}
              msg={msg.message}
              image={msg.image}
            />
          ),
        )}
        <div ref={scrollRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-3 md:p-6 pt-2 z-20 shrink-0 bg-[#050505] md:bg-transparent relative">
        {showPicker && (
          <div
            ref={pickerRef}
            className="absolute bottom-[80px] left-3 md:left-6 z-50 shadow-2xl rounded-2xl overflow-hidden border border-white/10"
          >
            <EmojiPicker
              theme="dark"
              onEmojiClick={(e) => setInput((prev) => prev + e.emoji)}
              width={300}
              height={400}
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}

        <form
          onSubmit={handleSend}
          className="relative flex items-center gap-2 p-1.5 md:p-2 bg-[#121212] md:bg-[#050505]/60 backdrop-blur-xl border border-white/10 rounded-[24px]"
        >
          <button
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            className="p-2 md:p-3 text-white/30 hover:text-white"
          >
            <Smile size={18} />
          </button>

          <label className="hidden md:block p-3 text-white/30 hover:text-white cursor-pointer">
            <ImageIcon size={20} />
            <input type="file" hidden accept="image/*" onChange={handleImage} />
          </label>

          {frontendImage && (
            <div className="relative shrink-0">
              <img
                src={frontendImage}
                className="w-10 h-10 rounded-lg object-cover"
                alt="preview"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center"
              >
                <X size={10} />
              </button>
            </div>
          )}

          {/* 🟢 CHANGED: Use handleInputChange instead of setInput directly */}
          <input
            value={input}
            onChange={handleInputChange}
            placeholder={frontendImage ? "Add a caption..." : "Message..."}
            className="flex-1 bg-transparent text-white placeholder-white/20 outline-none"
          />

          {!input.trim() && !frontendImage && (
            <button type="button" className="p-2 text-white/30">
              <Mic size={18} />
            </button>
          )}

          <button
            type="submit"
            disabled={!input.trim() && !frontendImage}
            className={`h-9 w-9 flex items-center justify-center rounded-full ${
              input.trim() || frontendImage
                ? "bg-indigo-600"
                : "bg-white/5 text-white/20"
            }`}
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default MessageArea;
