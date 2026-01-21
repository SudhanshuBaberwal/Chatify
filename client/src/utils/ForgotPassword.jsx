import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  // --- STATE ---
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- REFS ---
  const mountRef = useRef(null);
  const cardRef = useRef(null);

  // --- HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
        toast.error("Please enter your email address");
        return;
    }

    setLoading(true);
    try {
      // API CALL - Adjust endpoint as needed
      const result = await axios.post(
        "http://localhost:3000/api/auth/forgot-password",
        { email }, // Sending email in body
        { withCredentials: true }
      );

      console.log(result);
      toast.success(result.data.message || "Reset link sent!");
      setLoading(false);
      
      // Animate card out and switch to success state
      gsap.to(cardRef.current, {
          scale: 0.95,
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
              setIsSubmitted(true);
              gsap.to(cardRef.current, { scale: 1, opacity: 1, duration: 0.5 });
          }
      });

    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // --- 1. THREE.JS BACKGROUND ---
  useEffect(() => {
    const currentMount = mountRef.current;
    
    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.03);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    if (currentMount) currentMount.appendChild(renderer.domElement);

    // Particles (Locks/Keys metaphor represented abstractly)
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x6366f1, // Indigo
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });

    const particles = [];
    for (let i = 0; i < 20; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10
        );
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        particles.push(mesh);
        scene.add(mesh);
    }

    // Animation Loop
    let animationId;
    const animate = () => {
      particles.forEach((p, i) => {
          p.rotation.x += 0.002;
          p.rotation.y += 0.002;
          p.position.y += 0.005 * (i % 2 === 0 ? 1 : -1);
          if (Math.abs(p.position.y) > 8) p.position.y *= -1;
      });
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
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
      cancelAnimationFrame(animationId);
      if(currentMount && renderer.domElement) currentMount.removeChild(renderer.domElement);
    };
  }, []);

  // --- 2. GSAP ENTRANCE ---
  useEffect(() => {
      gsap.fromTo(cardRef.current, 
        { y: 50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
      );
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden flex items-center justify-center font-sans text-white">
      
      {/* BACKGROUND */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* CARD */}
      <div 
        ref={cardRef}
        className="relative z-10 w-full max-w-md p-8 sm:p-10 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Decorative Top Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        {!isSubmitted ? (
            // --- FORM STATE ---
            <>
                <div className="mb-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 border border-indigo-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 11 11 11.207l-4.293 4.293a1 1 0 01-1.414 0l-1.414-1.414a1 1 0 010-1.414L8.207 8.293 8 8l4.257-3.257A6 6 0 0121 9z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Forgot Password?
                    </h2>
                    <p className="text-gray-400 mt-2 text-sm">
                        No worries, we'll send you reset instructions.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="group">
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-indigo-400 transition-colors">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:bg-white/5 transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-900/20 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                             <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                            </>
                        ) : (
                            "Send Reset Link"
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-sm text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Log in
                    </Link>
                </div>
            </>
        ) : (
            // --- SUCCESS STATE ---
            <div className="text-center py-4">
                <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Check your email</h3>
                <p className="text-gray-400 text-sm mb-8">
                    We sent a password reset link to <br/>
                    <span className="text-white font-semibold">{email}</span>
                </p>
                <div className="flex flex-col gap-3">
                    <a 
                        href="https://gmail.com" 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
                    >
                        Open Email App
                    </a>
                    <button 
                        onClick={() => setIsSubmitted(false)}
                        className="text-sm text-gray-500 hover:text-indigo-400 transition-colors mt-2"
                    >
                        Didn't receive the email? Click to resend
                    </button>
                </div>
                 <div className="mt-8">
                    <Link to="/login" className="text-sm text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                        Back to Log in
                    </Link>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;