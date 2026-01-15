import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { Send, Paperclip, Phone, Video, MoreVertical, Smile, Mic, Image as ImageIcon } from "lucide-react";

const MessageArea = ({ 
    activeContact, 
    messages = [], 
    onSend 
}) => {
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const [text, setText] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    // --- 1. GSAP: Message Entrance Animation ---
    useLayoutEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        
        // Find the last message bubble added
        const bubbles = containerRef.current?.querySelectorAll('.msg-bubble');
        if (bubbles && bubbles.length > 0) {
            const lastBubble = bubbles[bubbles.length - 1];
            
            gsap.fromTo(lastBubble, 
                { opacity: 0, y: 20, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
            );
        }
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim() && onSend) {
            onSend(text);
            setText("");
        }
    };

    return (
        <div className="flex-1 h-full relative flex flex-col bg-[#050505] overflow-hidden font-sans isolate">
            
            {/* --- BACKGROUND: FLUID AURORA --- */}
            {/* These divs move around to create the living background effect */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[100px] animate-blob mix-blend-screen"></div>
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-indigo-900/20 blur-[100px] animate-blob animation-delay-2000 mix-blend-screen"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[100px] animate-blob animation-delay-4000 mix-blend-screen"></div>
                
                {/* Grain Texture Overlay for that "Premium" feel */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }}></div>
            </div>

            {/* --- HEADER --- */}
            <header className="h-[80px] px-8 flex items-center justify-between border-b border-white/5 bg-white/[0.02] backdrop-blur-xl z-20">
                {activeContact ? (
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img src={activeContact.avatar} alt="" className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10" />
                            {activeContact.status === 'online' && (
                                <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-[#4ade80] border-2 border-black rounded-full shadow-[0_0_10px_#4ade80]"></div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-white font-semibold text-[17px] tracking-tight">{activeContact.name}</h2>
                            <p className="text-white/40 text-xs font-medium">
                                {activeContact.status === 'online' ? 'Active Now' : 'Offline'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 opacity-30">
                        <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse"></div>
                        <div className="h-4 w-32 bg-white/10 rounded animate-pulse"></div>
                    </div>
                )}

                {activeContact && (
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl text-white/50 hover:bg-white/5 hover:text-white transition-all"><Phone size={20} /></button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl text-white/50 hover:bg-white/5 hover:text-white transition-all"><Video size={20} /></button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl text-white/50 hover:bg-white/5 hover:text-white transition-all"><MoreVertical size={20} /></button>
                    </div>
                )}
            </header>


            {/* --- MESSAGES LIST --- */}
            <div 
                ref={containerRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 z-10 custom-scrollbar"
            >
                {!activeContact ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center mb-6 border border-white/5 shadow-2xl backdrop-blur-sm">
                            <span className="text-3xl">👋</span>
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">Welcome Back</h3>
                        <p className="text-white/40 text-sm max-w-xs">Select a conversation from the sidebar to start chatting.</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.senderId === "me";
                        const showAvatar = !isMe && (idx === messages.length - 1 || messages[idx + 1]?.senderId === "me");

                        return (
                            <div key={idx} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} group msg-bubble`}>
                                
                                {/* Avatar (Only for received messages) */}
                                {!isMe && (
                                    <div className={`w-8 h-8 mr-3 flex-shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                                        <img src={activeContact.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                                    </div>
                                )}

                                <div className={`max-w-[65%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    {/* The Bubble */}
                                    <div className={`
                                        px-5 py-3.5 relative text-[15px] leading-relaxed shadow-sm
                                        ${isMe 
                                            ? 'bg-gradient-to-br from-[#6366f1] to-[#4f46e5] text-white rounded-[20px] rounded-br-none shadow-[0_8px_20px_-5px_rgba(79,70,229,0.4)]' 
                                            : 'bg-white/10 backdrop-blur-md text-gray-100 border border-white/5 rounded-[20px] rounded-bl-none'
                                        }
                                    `}>
                                        {msg.text}
                                    </div>
                                    
                                    {/* Timestamp */}
                                    <span className={`text-[10px] mt-1.5 opacity-0 group-hover:opacity-50 transition-opacity text-gray-400 font-medium select-none`}>
                                        {msg.timestamp || "Now"}
                                    </span>
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>


            {/* --- INPUT AREA --- */}
            <div className="p-6 pt-2 z-20">
                <form 
                    onSubmit={handleSubmit}
                    className={`
                        relative w-full flex items-center gap-3 p-2 pl-4 pr-2
                        bg-[#0f0f12]/80 backdrop-blur-2xl
                        border transition-all duration-300 rounded-[24px]
                        ${isFocused ? 'border-indigo-500/50 shadow-[0_0_40px_-10px_rgba(99,102,241,0.2)]' : 'border-white/10 shadow-lg'}
                    `}
                >
                    {/* Attachments */}
                    <button type="button" className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all">
                        <Paperclip size={18} />
                    </button>
                    <button type="button" className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all">
                        <ImageIcon size={18} />
                    </button>

                    {/* Text Field */}
                    <input 
                        type="text" 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={activeContact ? "Write a message..." : "Select a chat"}
                        disabled={!activeContact}
                        className="flex-1 bg-transparent text-white placeholder-gray-500 text-[15px] focus:outline-none h-11"
                    />

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        {!text.trim() && (
                            <button type="button" className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all">
                                <Mic size={20} />
                            </button>
                        )}
                        <button 
                            type="submit" 
                            disabled={!text.trim()}
                            className={`
                                h-10 w-10 flex items-center justify-center rounded-full text-white transition-all duration-200
                                ${text.trim() 
                                    ? 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 rotate-0 scale-100' 
                                    : 'bg-transparent text-gray-600 rotate-90 scale-0 opacity-0 hidden'
                                }
                            `}
                        >
                            <Send size={18} className="ml-0.5" />
                        </button>
                    </div>
                </form>
                
                <div className="text-center mt-2">
                    <p className="text-[10px] text-gray-600 flex items-center justify-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500/20 flex items-center justify-center"><span className="w-1 h-1 bg-green-500 rounded-full"></span></span>
                        End-to-end encrypted
                    </p>
                </div>
            </div>


            {/* --- GLOBAL STYLES FOR ANIMATION & SCROLL --- */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 100px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }

                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 10s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default MessageArea;