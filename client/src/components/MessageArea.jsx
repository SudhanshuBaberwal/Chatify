import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { Send, Paperclip, ArrowLeft, Phone, Video, Info, Mic, Image as ImageIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const INITIAL_DATA = [
    { id: 1, text: "Analyzing the grid patterns now.", sender: "them", time: "10:30 AM" },
    { id: 2, text: "Can you adjust the bloom intensity on the rendering engine?", sender: "me", time: "10:32 AM" },
    { id: 3, text: "Affirmative. Compiling the shaders. It should look cleaner.", sender: "them", time: "10:33 AM" },
    { id: 4, text: "Send me the preview when done.", sender: "me", time: "10:35 AM" },
];

const MessageArea = ({ onBack }) => {
    // Redux State
    const { selectedUsers } = useSelector(state => state.user);
    const dispatch = useDispatch();
    
    // Local State
    const [messages, setMessages] = useState(INITIAL_DATA);
    const [input, setInput] = useState("");
    const scrollRef = useRef(null);
    const containerRef = useRef(null);

    // --- ANIMATION: New Messages Entrance ---
    useLayoutEffect(() => {
        if (!selectedUsers) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(".chat-bubble", 
                { opacity: 0, y: 30, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.05, ease: "back.out(1.2)" }
            );
        }, containerRef);
        return () => ctx.revert();
    }, [selectedUsers]);

    // Auto Scroll
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages([...messages, { id: Date.now(), text: input, sender: "me", time: "Now" }]);
        setInput("");
        
        // Quick snap animation for the new message
        setTimeout(() => {
            const bubbles = document.querySelectorAll('.chat-bubble');
            const last = bubbles[bubbles.length - 1];
            if (last) {
                gsap.fromTo(last, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.4, ease: "elastic.out(1, 0.7)" });
            }
        }, 10);
    };

    // --- EMPTY STATE ---
   // ===== MOBILE: HIDE MESSAGE AREA IF NO USER SELECTED =====
if (!selectedUsers) {
  return (
    <div className="hidden md:flex flex-1">
      {/* Desktop empty state only */}
      <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 select-none">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-500/30 blur-[40px] rounded-full animate-pulse" />
          <div className="relative w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center backdrop-blur-xl">
            <span className="text-4xl">✨</span>
          </div>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">
          Welcome to Flux
        </h2>
        <p className="text-white/40 max-w-sm font-light text-sm md:text-base">
          Select a neural link from the sidebar to establish a secure connection.
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
                    {/* Back Button (Mobile Only) */}
                    <button onClick={onBack} className="md:hidden w-8 h-8 flex items-center justify-center rounded-full active:bg-white/10 text-white/70 transition-colors -ml-2">
                        <ArrowLeft size={20} />
                    </button>
                    
                    <div className="relative shrink-0">
                        <img src={selectedUsers.image || "https://via.placeholder.com/40"} className="w-9 h-9 md:w-11 md:h-11 rounded-full object-cover ring-2 ring-white/10" alt="" />
                        {/* Status Dot (Optional) */}
                        {/* <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-[2px] border-[#0a0a0a] rounded-full"></div> */}
                    </div>
                    
                    <div className="min-w-0">
                        <h3 className="font-bold text-white text-[15px] md:text-[17px] tracking-tight leading-tight truncate">
                            {selectedUsers.fullname || "Unknown User"}
                        </h3>
                        {/* Mobile: hide role if too long, Desktop: show */}
                        <p className="text-xs text-indigo-300 font-medium opacity-80 truncate">Active Now</p>
                    </div>
                </div>

                <div className="flex items-center gap-1 md:gap-2 shrink-0">
                    <button className="w-9 h-9 md:w-10 md:h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"><Phone size={18} /></button>
                    <button className="w-9 h-9 md:w-10 md:h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"><Video size={18} /></button>
                    <div className="hidden md:block w-[1px] h-6 bg-white/10 mx-1"></div>
                    <button className="hidden md:flex w-10 h-10 rounded-full hover:bg-white/10 items-center justify-center text-white/50 hover:text-white transition-all"><Info size={18} /></button>
                </div>
            </div>

            {/* --- CHAT AREA --- */}
            <div ref={containerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 custom-scrollbar scroll-smooth relative z-10">
                <div className="text-center py-4 md:py-6">
                    <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-white/30 uppercase tracking-widest font-semibold">
                        Today
                    </div>
                </div>

                {messages.map((msg) => {
                    const isMe = msg.sender === "me";
                    return (
                        <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} chat-bubble group`}>
                            {/* Avatar for Them (Hidden on mobile to save space, shown on Desktop) */}
                            {!isMe && (
                                <img src={selectedUsers.image} className="hidden md:block w-8 h-8 rounded-full object-cover mr-3 self-end mb-1 opacity-70" alt="" />
                            )}

                            <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`
                                    px-4 py-3 md:px-6 md:py-3.5 text-[14px] md:text-[15px] leading-relaxed relative shadow-lg backdrop-blur-md
                                    ${isMe 
                                        ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl rounded-br-sm border border-white/10' 
                                        : 'bg-white/10 md:bg-white/5 text-gray-100 rounded-2xl rounded-bl-sm border border-white/5'
                                    }
                                `}>
                                    {msg.text}
                                </div>
                                <span className={`text-[10px] mt-1 md:mt-2 opacity-50 md:opacity-0 md:group-hover:opacity-40 transition-opacity text-white font-medium px-1`}>
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* --- INPUT AREA --- */}
            <div className="p-3 md:p-6 pt-2 z-20 shrink-0 bg-[#050505] md:bg-transparent">
                <form 
                    onSubmit={handleSend}
                    className="relative flex items-center gap-2 p-1.5 md:p-2 bg-[#121212] md:bg-[#050505]/60 backdrop-blur-xl border border-white/10 rounded-[20px] md:rounded-[24px] shadow-lg md:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] focus-within:border-indigo-500/50 transition-all duration-300"
                >
                    {/* Attach Button */}
                    <button type="button" className="p-2 md:p-3 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all shrink-0">
                        <Paperclip size={18} className="md:w-5 md:h-5" />
                    </button>
                    
                    {/* Desktop Only Icons */}
                    <button type="button" className="hidden md:block p-3 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all">
                        <ImageIcon size={20} />
                    </button>

                    {/* Input Field */}
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Message..." 
                        className="flex-1 bg-transparent text-white placeholder-white/20 text-sm md:text-[15px] h-9 md:h-10 focus:outline-none px-1"
                    />

                    {/* Mic (Visible when empty) */}
                    {!input.trim() && (
                        <button type="button" className="p-2 md:p-3 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all shrink-0">
                            <Mic size={18} className="md:w-5 md:h-5" />
                        </button>
                    )}

                    {/* Send Button (Always visible on mobile to hold layout, but dimmed if empty) */}
                    <button 
                        type="submit" 
                        disabled={!input.trim()}
                        className={`
                            h-9 w-9 md:h-11 md:w-11 flex items-center justify-center rounded-full text-white transition-all duration-300 shrink-0
                            ${input.trim() 
                                ? 'bg-indigo-600 hover:bg-indigo-500 shadow-lg scale-100 rotate-0' 
                                : 'bg-white/5 text-white/20 md:scale-90 md:rotate-90 md:hidden flex' // On mobile keep flex but dim
                            }
                        `}
                    >
                        <Send size={16} className={`md:w-[18px] md:h-[18px] ${input.trim() ? "translate-x-0.5 translate-y-0.5" : ""}`} />
                    </button>
                </form>
                
                {/* Footer Text (Hidden on small mobiles) */}
                <p className="hidden md:flex text-center text-[10px] text-white/20 mt-3 items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></span>
                    Encrypted via Quantum Protocol
                </p>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            `}</style>
        </div>
    );
};

export default MessageArea;