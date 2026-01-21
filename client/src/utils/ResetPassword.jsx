import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPassword = () => {
  // --- STATE ---
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Get the token from the URL (usually passed as /reset-password/:token)
  const { token } = useParams(); 
  const navigate = useNavigate();

  // --- REFS ---
  const mountRef = useRef(null);
  const cardRef = useRef(null);
  const formRef = useRef(null);

  // --- HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Client-side Validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      // Shake animation on error
      gsap.fromTo(formRef.current, { x: -10 }, { x: 10, duration: 0.1, repeat: 5, yoyo: true });
      return;
    }
    
    if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
    }

    setLoading(true);

    try {
      // 2. API CALL
      // Sending 'password' in the BODY as requested
      const result = await axios.post(
        `http://localhost:3000/api/auth/reset-password/${token}`, 
        { password }, 
        { withCredentials: true }
      );

      console.log(result);
      toast.success(result.data.message || "Password reset successful!");
      setLoading(false);

      // 3. Success & Redirect
      navigate("/login");

    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  // --- 1. THREE.JS BACKGROUND (The Encryption Knot) ---
  useEffect(() => {
    const currentMount = mountRef.current;
    
    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.03);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    if (currentMount) currentMount.appendChild(renderer.domElement);

    // Object: Torus Knot (Symbolizes complex security)
    const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x8b5cf6, // Violet
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    // Add some floating particles around it
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x06b6d4, // Cyan
        transparent: true,
        opacity: 0.8
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Animation Loop
    let animationId;
    const animate = () => {
      torusKnot.rotation.x += 0.005;
      torusKnot.rotation.y += 0.005;
      
      particlesMesh.rotation.y = -torusKnot.rotation.y * 0.5; // Counter rotation

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
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // --- 2. GSAP ENTRANCE ---
  useEffect(() => {
    gsap.fromTo(cardRef.current, 
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "elastic.out(1, 0.6)" }
    );
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden flex items-center justify-center font-sans text-white">
      
      {/* BACKGROUND */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* CARD */}
      <div 
        ref={cardRef}
        className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Glow Effect at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70"></div>

        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
                New Password
            </h2>
            <p className="text-gray-400 text-sm mt-2">
                Create a strong password to secure your account.
            </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            {/* New Password Input */}
            <div className="group">
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 ml-1 group-focus-within:text-violet-400 transition-colors">
                    New Password
                </label>
                <div className="relative">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:bg-white/5 transition-all"
                    />
                    <div className="absolute right-3 top-3 text-gray-500">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Confirm Password Input */}
            <div className="group">
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 ml-1 group-focus-within:text-cyan-400 transition-colors">
                    Confirm Password
                </label>
                <div className="relative">
                     <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:bg-white/5 transition-all"
                    />
                    <div className="absolute right-3 top-3 text-gray-500">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold shadow-lg shadow-violet-900/20 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                    </>
                ) : (
                    "Reset Password"
                )}
            </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;