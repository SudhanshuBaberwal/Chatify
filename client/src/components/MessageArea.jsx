import axios from "axios";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import {
  Send,
  Smile,
  ArrowLeft,
  Phone,
  Video,
  Info,
  Mic,
  Image as ImageIcon,
  X, // Import X icon for closing the preview
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import { setMessages } from "../redux/message.Slice";
// --- IMPORT NEW COMPONENTS ---
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";

const INITIAL_DATA = [
  {
    id: 1,
    text: "Analyzing the grid patterns now.",
    sender: "them",
    time: "10:30 AM",
  },
  {
    id: 2,
    text: "Can you adjust the bloom intensity on the rendering engine?",
    sender: "me",
    time: "10:32 AM",
  },
  {
    id: 3,
    text: "Affirmative. Compiling the shaders. It should look cleaner.",
    sender: "them",
    time: "10:33 AM",
  },
  {
    id: 4,
    text: "Send me the preview when done.",
    sender: "me",
    time: "10:35 AM",
  },
];

const MessageArea = ({ onBack }) => {
  // Redux
  const { selectedUsers, userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // console.log(selectedUsers._id)

  if (!userData?.user._id) {
  return (
    <div className="flex flex-1 items-center justify-center text-white/40">
      Loading chat...
    </div>
  );
}


  // State
  // const [messages, setMessages] = useState(INITIAL_DATA);
  let { messages } = useSelector((state) => state.message);
  const [input, setInput] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  // Refs
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const pickerRef = useRef(null);
  const buttonRef = useRef(null);

  // --- HANDLER: Select Image ---
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file)); // Create preview URL
    }
  };

  // --- HANDLER: Remove Image ---
  const clearImage = () => {
    setFrontendImage(null);
    setBackendImage(null);
  };

  // --- HANDLER: Send Message ---
  const handleSend = async (e) => {
    e.preventDefault();
    // Allow sending if there is text OR an image
    if (!input.trim() && !frontendImage) return;

    // 1. Update UI immediately (Optimistic UI)
    // const newMessage = {
    //   id: Date.now(),
    //   text: input,
    //   sender: "me",
    //   time: "Now",
    //   image: frontendImage,
    // };

    // setMessages((prev) => [...prev, newMessage]);

    // 2. Clear Input States
    setInput("");
    setShowPicker(false);
    clearImage(); // Clear the image preview

    // 3. API Call (Background)
    try {
      let formData = new FormData();
      formData.append("message", input);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      let res = await axios.post(
        `http://localhost:3000/api/message/send/${selectedUsers._id}`,
        formData,
        { withCredentials: true },
      );
      // console.log(res.data.messages)
      dispatch(
        setMessages([
          ...(Array.isArray(messages) ? messages : []),
          res.data.message ?? res.data,
        ]),
      );

      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
    } catch (error) {
      console.error("Failed to send", error);
    }

    // 4. Animation
    setTimeout(() => {
      const bubbles = document.querySelectorAll(".chat-bubble");
      const last = bubbles[bubbles.length - 1];
      if (last) {
        gsap.fromTo(
          last,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.4, ease: "elastic.out(1, 0.8)" },
        );
      }
    }, 10);
  };

  // Animation on User Change
  // useLayoutEffect(() => {
  //   if (!selectedUsers) return;
  //   const ctx = gsap.context(() => {
  //     gsap.fromTo(
  //       ".chat-bubble",
  //       { opacity: 0, y: 20, scale: 0.95 },
  //       {
  //         opacity: 1,
  //         y: 0,
  //         scale: 1,
  //         duration: 0.4,
  //         stagger: 0.05,
  //         ease: "power2.out",
  //       },
  //     );
  //   }, containerRef);
  //   return () => ctx.revert();
  // }, [selectedUsers]);

  // Auto Scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close Picker on Click Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showPicker &&
        pickerRef.current &&
        !pickerRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  if (!selectedUsers) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center text-center p-8 select-none">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/30 blur-[40px] rounded-full animate-pulse" />
          <h2 className="text-2xl font-bold text-white relative z-10">
            Welcome to Flux
          </h2>
          <p className="text-white/40 relative z-10">
            Select a secure link to begin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full relative bg-[#050505] md:bg-transparent">
      {/* --- HEADER --- */}
      <div className="h-16 md:h-20 px-4 md:px-6 flex items-center justify-between border-b border-white/5 bg-white/[0.01] backdrop-blur-md z-20 shrink-0">
        <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
          <button
            onClick={onBack}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-full text-white/70 -ml-2"
          >
            <ArrowLeft size={20} />
          </button>
          <img
            src={selectedUsers.image || "https://via.placeholder.com/40"}
            className="w-9 h-9 md:w-11 md:h-11 rounded-full object-cover ring-2 ring-white/10"
            alt=""
          />
          <div className="min-w-0">
            <h3 className="font-bold text-white text-[15px] md:text-[17px] truncate">
              {selectedUsers.fullname}
            </h3>
            <p className="text-xs text-indigo-300 opacity-80 truncate">
              Active Now
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

      {/* --- CHAT AREA --- */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar scroll-smooth relative z-10"
      >
        <div className="text-center py-4">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-white/30 uppercase font-semibold">
            Today
          </span>
        </div>

        {Array.isArray(messages) &&
          messages.map((msg) =>
            msg.sender === userData.user._id ? (
              <SenderMessage key={msg._id} image={msg.image} msg={msg.message} />
            ) : (
              <ReceiverMessage key={msg._id} image={msg.image} msg={msg.message} />
            ),
          )}

        <div ref={scrollRef} />
      </div>

      {/* --- INPUT AREA --- */}
      <div className="p-3 md:p-6 pt-2 z-20 shrink-0 bg-[#050505] md:bg-transparent relative">
        {showPicker && (
          <div
            ref={pickerRef}
            className="absolute bottom-[80px] left-3 md:left-6 z-50 shadow-2xl rounded-2xl overflow-hidden border border-white/10 animate-in fade-in zoom-in-95 duration-200"
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
          className="relative flex items-center gap-2 p-1.5 md:p-2 bg-[#121212] md:bg-[#050505]/60 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-lg transition-all focus-within:border-indigo-500/50"
        >
          <button
            ref={buttonRef}
            onClick={() => setShowPicker(!showPicker)}
            type="button"
            className={`p-2 md:p-3 rounded-full transition-all shrink-0 ${showPicker ? "text-indigo-400 bg-white/10" : "text-white/30 hover:text-white"}`}
          >
            <Smile size={18} className="md:w-5 md:h-5" />
          </button>

          {/* Image Upload Button */}
          <button
            type="button"
            className="hidden md:block p-3 text-white/30 hover:text-white rounded-full group transition-colors"
          >
            <label className="cursor-pointer flex items-center justify-center w-full h-full">
              <ImageIcon
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImage}
              />
            </label>
          </button>

          {/* === IMAGE PREVIEW IN INPUT === */}
          {frontendImage && (
            <div className="relative group shrink-0 mr-1 animate-in fade-in zoom-in duration-200">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border border-white/20 relative">
                <img
                  src={frontendImage}
                  alt="preview"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              {/* Remove Image Button */}
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
              >
                <X size={10} strokeWidth={3} />
              </button>
            </div>
          )}

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={frontendImage ? "Add a caption..." : "Message..."}
            onFocus={() => setShowPicker(false)}
            className="flex-1 bg-transparent text-white placeholder-white/20 text-sm md:text-[15px] h-9 md:h-10 focus:outline-none px-1"
          />

          {!input.trim() && !frontendImage && (
            <button
              type="button"
              className="p-2 md:p-3 text-white/30 hover:text-white rounded-full shrink-0"
            >
              <Mic size={18} className="md:w-5 md:h-5" />
            </button>
          )}

          <button
            type="submit"
            // Disable only if BOTH input and image are missing
            disabled={!input.trim() && !frontendImage}
            className={`h-9 w-9 md:h-11 md:w-11 flex items-center justify-center rounded-full text-white transition-all shrink-0 ${
              input.trim() || frontendImage
                ? "bg-indigo-600 shadow-lg scale-100"
                : "bg-white/5 text-white/20 scale-95"
            }`}
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            `}</style>
    </div>
  );
};

export default MessageArea;
