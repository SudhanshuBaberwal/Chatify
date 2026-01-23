import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// 1. Import the Icon
import { ArrowLeft } from "lucide-react";

const Profile = () => {
  // --- REDUX & STATE (Your Backend Logic) ---
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [name, setName] = useState(userData?.user?.fullname || "User Name");
  const [descripition, setDescripition] = useState(userData?.descripition || ""); 
  const [imagePreview, setImagePreview] = useState(
    userData?.user?.image ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
  );
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Navigation Hook
  let navigate = useNavigate();

  // --- REFS ---
  const mountRef = useRef(null); 
  const imageContainerRef = useRef(null); 
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  // --- HANDLERS ---
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("descripition", descripition);
      if (backendImage) {
        formData.append("image", backendImage);
      }     
      
      const result = await axios.put(
        "http://localhost:3000/api/user/profile",
        formData,
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      setLoading(false);
      toast.success("Profile Updated Successfully")
      navigate("/")

      gsap.to(formRef.current, { x: 5, duration: 0.1, yoyo: true, repeat: 3 });

    } catch (error) {
      console.log("Error : ", error);
      setLoading(false);
    }
  };

  // --- 1. THREE.JS BACKGROUND ---
  useEffect(() => {
    const currentMount = mountRef.current;
    
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.02);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    if (currentMount) currentMount.appendChild(renderer.domElement);

    const bubblesGroup = new THREE.Group();
    scene.add(bubblesGroup);

    const geometry = new THREE.PlaneGeometry(3, 1.5);
    
    const createBubbleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      if (ctx.roundRect) ctx.roundRect(4, 4, 120, 56, 20);
      else ctx.fillRect(4, 4, 120, 56);
      ctx.fill();
      ctx.fillStyle = "#e5e5e5";
      ctx.fillRect(20, 20, 60, 6);
      ctx.fillRect(20, 35, 40, 6);
      return new THREE.CanvasTexture(canvas);
    };

    const bubbleTexture = createBubbleTexture();
    const materialLeft = new THREE.MeshBasicMaterial({ map: bubbleTexture, transparent: true, opacity: 0.08, color: 0x8b5cf6, side: THREE.DoubleSide });
    const materialRight = new THREE.MeshBasicMaterial({ map: bubbleTexture, transparent: true, opacity: 0.08, color: 0x06b6d4, side: THREE.DoubleSide });

    const bubbles = [];
    for (let i = 0; i < 40; i++) {
      const isRight = Math.random() > 0.5;
      const mesh = new THREE.Mesh(geometry, isRight ? materialRight : materialLeft);
      mesh.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10 - 2);
      const scale = Math.random() * 0.5 + 0.3;
      mesh.scale.set(scale, scale, 1);
      mesh.userData = { speed: Math.random() * 0.01 + 0.005 };
      bubbles.push(mesh);
      bubblesGroup.add(mesh);
    }

    const animate = () => {
      bubbles.forEach(b => {
        b.position.y += b.userData.speed;
        if (b.position.y > 10) b.position.y = -10;
        b.lookAt(camera.position);
      });
      bubblesGroup.rotation.y += 0.001;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if(currentMount && renderer.domElement) currentMount.removeChild(renderer.domElement);
      geometry.dispose();
      materialLeft.dispose();
      materialRight.dispose();
    };
  }, []);

  // --- 2. GSAP ENTRANCE ---
  useEffect(() => {
    const tl = gsap.timeline();
    // 2. Added animation for the back button
    tl.fromTo(".back-btn", 
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
    )
    .fromTo(".glass-panel", 
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" },
      "-=0.3"
    )
    .fromTo(".form-input", 
      { opacity: 0, x: -20 }, 
      { opacity: 1, x: 0, stagger: 0.1, duration: 0.8, ease: "power2.out" }, 
      "-=0.5"
    )
    .fromTo(".image-3d",
      { opacity: 0, x: 50, rotateY: 90 },
      { opacity: 1, x: 0, rotateY: -15, duration: 1.2, ease: "back.out(1.7)" },
      "-=1"
    );
  }, []);

  // --- 3. MOUSE TILT EFFECT ---
  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const xPos = (clientX / innerWidth - 0.5) * 2;
    const yPos = (clientY / innerHeight - 0.5) * 2;

    gsap.to(imageContainerRef.current, {
      rotationY: xPos * 15,
      rotationX: -yPos * 15,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 1000
    });
  };

  return (
    <div 
      className="relative w-full h-screen bg-[#050505] overflow-hidden flex items-center justify-center font-sans text-white"
      onMouseMove={handleMouseMove} 
    >
      {/* 3. NEW: Back Button */}
      <button 
        onClick={() => navigate("/")}
        className="back-btn absolute top-6 left-6 z-50 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all backdrop-blur-md group"
      >
        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* BACKGROUND */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* GLASS PANEL CONTAINER */}
      <div className="glass-panel relative z-10 w-full max-w-5xl h-auto md:h-[600px] bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl flex flex-col-reverse md:flex-row overflow-hidden">
        
        {/* --- LEFT SIDE: FORM --- */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center border-t md:border-t-0 md:border-r border-white/10 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-cyan-500"></div>
          
          <div ref={formRef} className="max-w-md mx-auto w-full">
            <h1 className="form-input text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Edit Profile
            </h1>
            <p className="form-input text-gray-400 text-sm mb-8">
              Update your personal details below.
            </p>

            <form onSubmit={handleProfile} className="space-y-6">
              <div className="form-input group">
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-violet-400 transition-colors">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:bg-white/5 transition-all"
                />
              </div>

              <div className="form-input group">
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-cyan-400 transition-colors">
                  Description / Bio
                </label>
                <textarea
                  rows="3"
                  value={descripition}
                  onChange={(e) => setDescripition(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:bg-white/5 transition-all resize-none"
                />
              </div>

              <div className="form-input flex items-center gap-4">
                 <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="px-4 py-2 text-sm rounded-lg border border-dashed border-white/30 hover:border-violet-500 hover:text-violet-400 transition-all text-gray-400"
                 >
                    Choose Image
                 </button>
                 <span className="text-xs text-gray-500 truncate max-w-[150px]">
                    {backendImage ? backendImage.name : "No file chosen"}
                 </span>
                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImage} 
                    className="hidden" 
                    accept="image/*"
                 />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="form-input w-full mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-violet-900/30 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Syncing..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>

        {/* --- RIGHT SIDE: 3D IMAGE VISUALIZER --- */}
        <div className="w-full md:w-1/2 relative flex items-center justify-center p-8 bg-black/20 overflow-hidden min-h-[300px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-600 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

            <div 
                ref={imageContainerRef}
                className="image-3d relative w-64 h-80 sm:w-80 sm:h-96 rounded-2xl shadow-2xl preserve-3d"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Main Image */}
                <div 
                    className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-white/10 z-10 bg-gray-900"
                    style={{ transform: "translateZ(20px)" }} 
                >
                    <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/10 pointer-events-none"></div>
                </div>

                {/* Floating Badge 1 (Online) */}
                <div 
                    className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-cyan-500/10 backdrop-blur-md border border-cyan-500/30 p-3 sm:p-4 rounded-xl shadow-lg z-20"
                    style={{ transform: "translateZ(60px)" }}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                        <span className="text-cyan-300 font-mono text-xs font-bold">ONLINE</span>
                    </div>
                </div>

                {/* Floating Badge 2 (User Name) */}
                <div 
                    className="absolute -bottom-4 -left-4 sm:-bottom-4 sm:-left-8 bg-violet-500/10 backdrop-blur-md border border-violet-500/30 px-4 py-2 sm:px-6 sm:py-3 rounded-xl shadow-lg z-20"
                    style={{ transform: "translateZ(40px)" }}
                >
                     <p className="text-violet-200 text-xs font-bold tracking-wider uppercase">@{name || "User"}</p>
                </div>

                {/* Depth Frame */}
                <div 
                    className="absolute inset-0 border border-white/5 rounded-2xl z-0"
                    style={{ transform: "translateZ(-20px) scale(1.05)" }}
                ></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;