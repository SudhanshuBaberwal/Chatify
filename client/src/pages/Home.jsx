import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Sidebar from "../components/Sidebar";
import MessageArea from "../components/MessageArea";


// --- DATA ---
const USERS = [
    { id: 1, name: "Elara Vance", role: "Visual Director", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop", status: "online", msg: "Rendering the final assets now.", time: "10:42 AM" },
    { id: 2, name: "Kaelen Thorne", role: "Sys Admin", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop", status: "idle", msg: "Server load is at 98%.", time: "09:15 AM" },
    { id: 3, name: "Nova Script", role: "AI Logic", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop", status: "online", msg: "Algorithm updated.", time: "Yesterday" },
    { id: 4, name: "Marcus Webb", role: "Frontend Lead", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop", status: "offline", msg: "Check the PR when you can.", time: "Mon" },
];

const Home = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const mainRef = useRef(null);

    // --- GSAP ENTRANCE ANIMATION ---
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".glass-panel", 
                { opacity: 0, y: 20, scale: 0.98 },
                { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
            );
        }, mainRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={mainRef} className="relative w-full h-[100dvh] bg-[#030014] text-white overflow-hidden font-sans selection:bg-purple-500/30">
            
            {/* --- 1. CINEMATIC BACKGROUND --- */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Moving Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-purple-600/20 rounded-full blur-[120px] animate-orbit-slow mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full blur-[120px] animate-orbit-reverse mix-blend-screen" />
                <div className="absolute top-[40%] left-[40%] w-[40vw] h-[40vw] bg-cyan-600/10 rounded-full blur-[100px] animate-pulse-slow mix-blend-screen" />
                
                {/* Noise Texture (The "Premium" Feel) */}
                <div className="absolute inset-0 opacity-[0.04]" 
                     style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} 
                />
            </div>

            {/* --- 2. GLASS UI LAYOUT --- */}
            <div className="relative z-10 w-full h-full flex p-0 md:p-6 md:gap-6">
                
                {/* SIDEBAR WRAPPER */}
                <div className={`
                    w-full md:w-[380px] lg:w-[420px] h-full flex flex-col 
                    transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                    ${selectedUser ? 'hidden md:flex' : 'flex'}
                `}>
                    {/* The "Glass" Container */}
                    <div className="glass-panel w-full h-full md:rounded-[32px] overflow-hidden bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative">
                        {/* Internal Reflection Glow */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
                        
                        <Sidebar 
                            users={USERS} 
                            selectedUser={selectedUser} 
                            onSelect={setSelectedUser} 
                        />
                    </div>
                </div>

                {/* CHAT WRAPPER */}
                <div className={`
                    flex-1 h-full flex-col relative
                    transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                    ${!selectedUser ? 'hidden md:flex' : 'flex'}
                `}>
                    <div className="glass-panel w-full h-full md:rounded-[32px] overflow-hidden bg-[#0a0a0a]/40 backdrop-blur-3xl border border-white/[0.08] shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative">
                        {/* Internal Reflection Glow */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
                        
                        <MessageArea 
                            user={selectedUser} 
                            onBack={() => setSelectedUser(null)} 
                        />
                    </div>
                </div>

            </div>

            {/* --- ANIMATIONS STYLE --- */}
            <style>{`
                @keyframes orbit-slow {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(30px, 50px) rotate(10deg); }
                    66% { transform: translate(-20px, 20px) rotate(-5deg); }
                    100% { transform: translate(0, 0) rotate(0deg); }
                }
                @keyframes orbit-reverse {
                    0% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-50px, -30px) scale(1.1); }
                    100% { transform: translate(0, 0) scale(1); }
                }
                .animate-orbit-slow { animation: orbit-slow 20s ease-in-out infinite; }
                .animate-orbit-reverse { animation: orbit-reverse 25s ease-in-out infinite; }
                .animate-pulse-slow { animation: orbit-reverse 15s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default Home;