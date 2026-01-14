import React, { useEffect, useRef, useState,  } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { Send, Paperclip, Mic, MoreVertical, Search, Zap } from "lucide-react";

// --- PROPS INTERFACE ---
// Pass your Redux state into these props:
// contacts: Array of users [{_id, name, avatar, status, lastMessage}]
// messages: Array of messages [{_id, senderId, text, createdAt}]
// currentUser: Object {_id, name, avatar}
// onSend: Function (text) => void

const Home = ({ 
    contacts = [], 
    messages = [], 
    currentUser = { _id: "me" }, 
    onSend 
}) => {
  const mountRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [inputValue, setInputValue] = useState("");
  const [activeContactId, setActiveContactId] = useState(null);

  // --- 1. THE "DATA RAIN" 3D BACKGROUND ---
  useEffect(() => {
    const currentMount = mountRef.current;
    
    // Scene Setup
    const scene = new THREE.Scene();
    // A dark, deep violet fog for depth
    scene.fog = new THREE.FogExp2(0x050505, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (currentMount) currentMount.appendChild(renderer.domElement);

    // --- INSTANCED MESH FOR PERFORMANCE (Thousand of particles) ---
    const particleCount = 1500;
    const geometry = new THREE.TetrahedronGeometry(0.5); // Futuristic shape
    const material = new THREE.MeshBasicMaterial({ color: 0x6d28d9, transparent: true, opacity: 0.6 });
    const mesh = new THREE.InstancedMesh(geometry, material, particleCount);
    
    const dummy = new THREE.Object3D();
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        const z = (Math.random() - 0.5) * 100;
        
        dummy.position.set(x, y, z);
        dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        
        particles.push({ 
            x, y, z, 
            speed: Math.random() * 0.2 + 0.05, 
            rotSpeed: Math.random() * 0.02 
        });
    }
    scene.add(mesh);

    // --- LIGHTS ---
    const pointLight = new THREE.PointLight(0x8b5cf6, 2, 100);
    pointLight.position.set(0, 0, 20);
    scene.add(pointLight);

    // --- ANIMATION LOOP ---
    let animationId;
    let mouseX = 0;
    let mouseY = 0;

    const animate = () => {
        let i = 0;
        for (let p of particles) {
            // Move particles up like data stream
            p.y += p.speed;
            p.z += Math.sin(Date.now() * 0.001 + i) * 0.05; // Subtle wave
            
            // Reset if out of view
            if (p.y > 100) p.y = -100;

            dummy.position.set(p.x, p.y, p.z);
            dummy.rotation.x += p.rotSpeed;
            dummy.rotation.y += p.rotSpeed;
            dummy.updateMatrix();
            mesh.setMatrixAt(i++, dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;

        // Subtle Camera Drift based on Mouse (Parallax)
        camera.position.x += (mouseX * 5 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 5 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
    };
    animate();

    // --- EVENT LISTENERS ---
    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    const handleMouseMove = (e) => {
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationId);
        if(currentMount && renderer.domElement) currentMount.removeChild(renderer.domElement);
        geometry.dispose(); material.dispose(); renderer.dispose();
    };
  }, []);

  // --- 2. GSAP UI ANIMATIONS ---
  // Entrance Animation
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(leftPanelRef.current, 
        { x: -100, opacity: 0, rotationY: 15 }, 
        { x: 0, opacity: 1, rotationY: 0, duration: 1.5, ease: "power3.out" }
    )
    .fromTo(rightPanelRef.current, 
        { x: 100, opacity: 0, rotationY: -15 }, 
        { x: 0, opacity: 1, rotationY: 0, duration: 1.5, ease: "power3.out" }, 
        "-=1.2"
    );
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- HANDLERS ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && onSend) {
      onSend(inputValue);
      setInputValue("");
      
      // Impulse Animation on Send
      gsap.to(rightPanelRef.current, { z: 50, duration: 0.1, yoyo: true, repeat: 1 });
    }
  };

  // 3. PARALLAX CARD LOGIC (The "Floating Glass" effect)
  const handlePanelMove = (e, ref, intensity = 20) => {
     const { left, top, width, height } = ref.current.getBoundingClientRect();
     const x = (e.clientX - left - width/2) / width;
     const y = (e.clientY - top - height/2) / height;
     
     gsap.to(ref.current, {
         rotationY: x * intensity,
         rotationX: -y * intensity,
         transformPerspective: 1000,
         duration: 0.5,
         ease: "power2.out"
     });
  };

  const resetPanel = (ref) => {
      gsap.to(ref.current, { rotationY: 0, rotationX: 0, duration: 1, ease: "elastic.out(1, 0.5)" });
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans text-gray-100 flex items-center justify-center gap-6 p-4 md:p-10">
      
      {/* 3D LAYER */}
      <div ref={mountRef} className="absolute inset-0 z-0" />
      
      {/* VIGNETTE OVERLAY */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_120%)] z-0 pointer-events-none" />

      {/* --- LEFT PANEL: CONTACTS DOCK --- */}
      <div 
        ref={leftPanelRef}
        onMouseMove={(e) => handlePanelMove(e, leftPanelRef, 10)}
        onMouseLeave={() => resetPanel(leftPanelRef)}
        className="hidden md:flex flex-col w-[350px] h-[85vh] z-10 bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-[30px] shadow-2xl relative overflow-hidden"
      >
        {/* Glow Effect */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-cyan-500 opacity-50" />

        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5">
            <h2 className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                UPLINK
            </h2>
            <div className="mt-4 relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-violet-400 transition" size={16} />
                <input 
                    type="text" 
                    placeholder="Search frequency..." 
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs tracking-wide focus:border-violet-500/50 focus:outline-none transition-all placeholder:text-gray-600"
                />
            </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {contacts.length === 0 && (
                <div className="text-center text-gray-600 text-xs mt-10">No active signals found.</div>
            )}
            
            {contacts.map((contact) => (
                <div 
                    key={contact._id} 
                    onClick={() => setActiveContactId(contact._id)}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all duration-300 group relative overflow-hidden ${
                        activeContactId === contact._id 
                        ? 'bg-violet-600/20 border-violet-500/50 shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]' 
                        : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'
                    }`}
                >
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="relative">
                            {/* Hexagon Mask or Circle */}
                            <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-b from-gray-700 to-transparent">
                                <img src={contact.avatar || "https://via.placeholder.com/50"} className="w-full h-full rounded-full object-cover" alt="User" />
                            </div>
                            {contact.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black flex items-center justify-center rounded-full">
                                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]"></div>
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className={`text-sm font-bold ${activeContactId === contact._id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                {contact.name || "Unknown User"}
                            </h3>
                            <p className="text-[10px] text-gray-500 truncate mt-1 tracking-wide">
                                {contact.lastMessage || "Connection established."}
                            </p>
                        </div>
                    </div>
                    {/* Hover Light Sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                </div>
            ))}
        </div>
        
        {/* Current User Mini-Bar */}
        <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-white/20" alt="Me" />
                <div className="text-xs">
                    <div className="text-white font-bold">{currentUser.name}</div>
                    <div className="text-violet-400 text-[10px]">ID: {currentUser._id.substring(0,6)}...</div>
                </div>
            </div>
            <Zap size={16} className="text-yellow-400 fill-yellow-400/20" />
        </div>
      </div>


      {/* --- RIGHT PANEL: ACTIVE CHAT --- */}
      <div 
        ref={rightPanelRef}
        className="flex-1 h-[85vh] max-w-[900px] z-10 flex flex-col bg-gray-900/60 backdrop-blur-2xl border border-white/10 rounded-[30px] shadow-2xl relative"
      >
        {/* Chat Header */}
        <div className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-black/20 to-transparent rounded-t-[30px]">
             {activeContactId ? (
                 <div className="flex items-center gap-4">
                     <div className="w-2 h-2 bg-violet-500 rounded-full shadow-[0_0_15px_#8b5cf6]"></div>
                     <div>
                        <h2 className="text-lg font-bold tracking-wider text-white">
                            {contacts.find(c => c._id === activeContactId)?.name || "Unknown"}
                        </h2>
                        <span className="text-[10px] text-violet-300 uppercase tracking-[0.2em] opacity-80">Encrypted Channel</span>
                     </div>
                 </div>
             ) : (
                 <div className="flex items-center gap-2 opacity-50">
                     <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                     <span className="text-xs uppercase tracking-widest">No Signal Locked</span>
                 </div>
             )}
             
             <button className="p-3 hover:bg-white/10 rounded-full transition-colors">
                <MoreVertical size={20} className="text-gray-400" />
             </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 select-none pointer-events-none">
                    <Zap size={64} className="text-violet-500 mb-4" />
                    <h3 className="text-2xl font-bold tracking-widest">ZERO-G LINK</h3>
                    <p className="text-sm mt-2">Waiting for transmission...</p>
                </div>
            ) : (
                messages.map((msg, index) => {
                    const isMe = msg.senderId === currentUser._id;
                    return (
                        <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[65%] p-4 rounded-2xl relative backdrop-blur-md transition-all hover:scale-[1.02] ${
                                isMe 
                                ? 'bg-violet-600/90 text-white rounded-br-sm shadow-[0_5px_15px_-5px_rgba(139,92,246,0.4)]' 
                                : 'bg-[#1a1a1a]/80 text-gray-200 border border-white/5 rounded-bl-sm'
                            }`}>
                                <p className="text-sm leading-relaxed font-light tracking-wide">{msg.text}</p>
                                <span className={`text-[9px] absolute -bottom-5 ${isMe ? 'right-0 text-violet-400' : 'left-0 text-gray-500'} opacity-70`}>
                                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    );
                })
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 pt-2">
            <form 
                onSubmit={handleSubmit}
                className="group relative flex items-center gap-4 bg-black/40 border border-white/10 p-2 pl-6 pr-2 rounded-2xl transition-all focus-within:border-violet-500/50 focus-within:bg-black/60 focus-within:shadow-[0_0_20px_-5px_rgba(139,92,246,0.2)]"
            >
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Transmit data..." 
                    className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder:text-gray-600 tracking-wide font-light"
                />
                
                <div className="flex items-center gap-1 text-gray-500 pr-2">
                    <button type="button" className="p-2 hover:text-violet-400 transition"><Paperclip size={18} /></button>
                    <button type="button" className="p-2 hover:text-violet-400 transition"><Mic size={18} /></button>
                </div>

                <button 
                    type="submit" 
                    disabled={!inputValue.trim()}
                    className="p-3 bg-white text-black rounded-xl hover:bg-violet-400 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold transform active:scale-95"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { bg: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8b5cf6; }
      `}</style>
    </div>
  );
};

export default Home;