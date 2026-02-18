import React, { useState, useRef, useLayoutEffect } from "react";
import { Eye, EyeOff, Lock, Mail, CheckCircle, ArrowRight } from "lucide-react";
import gsap from "gsap";

const Login = () => {
  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [viewState, setViewState] = useState("idle"); 

  // Refs
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const buttonRef = useRef(null);
  
  // Important: Reset ref arrays on every render to prevent "ghost" elements
  const inputRefs = useRef([]);
  const titleElementsRef = useRef([]);
  inputRefs.current = [];
  titleElementsRef.current = [];

  // Ref collectors
  const addToInputRefs = (el) => {
    if (el) inputRefs.current.push(el);
  };
  
  const addToTitleRefs = (el) => {
    if (el) titleElementsRef.current.push(el);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Background Shapes
      gsap.to(".bg-shape", {
        x: "random(-50, 50)",
        y: "random(-50, 50)",
        rotation: "random(0, 360)",
        duration: "random(10, 20)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Card Entrance
      gsap.from(cardRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });

      // Content Entrance
      const tl = gsap.timeline({ delay: 0.5 });
      
      // We use fromTo to ensure they definitely end up visible (opacity: 1)
      tl.fromTo(titleElementsRef.current, 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, ease: "power2.out", duration: 0.6 }
      )
      .fromTo(inputRefs.current, 
        { x: -10, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, ease: "power2.out", duration: 0.6 }, 
        "-=0.4"
      )
      .fromTo(buttonRef.current, 
        { y: 20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, ease: "back.out(1.7)", duration: 0.6 },
        "-=0.4"
      )
      .fromTo(".footer-link", 
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.2"
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleInputFocus = (index) => {
    if (inputRefs.current[index]) {
        gsap.to(inputRefs.current[index], {
            scale: 1.02,
            borderColor: "#3b82f6",
            boxShadow: "0 4px 20px -2px rgba(59, 130, 246, 0.2)",
            duration: 0.3,
        });
    }
  };

  const handleInputBlur = (index) => {
    if (inputRefs.current[index]) {
        gsap.to(inputRefs.current[index], {
            scale: 1,
            borderColor: "#e5e7eb",
            boxShadow: "none",
            duration: 0.3,
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setViewState("loading");

    gsap.to(buttonRef.current, {
      width: "50px",
      borderRadius: "50%",
      color: "transparent",
      duration: 0.3,
      onComplete: () => {
        setTimeout(() => handleSuccess(), 1500);
      }
    });
  };

  const handleSuccess = () => {
    setViewState("success");
    
    const tl = gsap.timeline();
    tl.to(buttonRef.current, {
      width: "100%",
      borderRadius: "0.5rem",
      backgroundColor: "#10b981",
      color: "white",
      duration: 0.4,
      ease: "power2.inOut"
    })
    .to(cardRef.current, {
        y: -5,
        boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.25)",
        duration: 0.5
    }, "<");

    setTimeout(() => {
        alert(`Successfully logged in as ${email}`);
        window.location.reload(); 
    }, 1200);
  };

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900 overflow-hidden relative"
    >
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="bg-shape absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="bg-shape absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-3xl" />
        <div className="bg-shape absolute top-[40%] left-[60%] w-64 h-64 bg-pink-300/20 rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <div 
        ref={cardRef}
        className="relative max-w-md w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-10 border border-white/50 z-10"
      >
        <div className="text-center mb-8">
          <h2 ref={addToTitleRefs} className="text-3xl font-bold mb-2 text-gray-800 tracking-tight">Welcome back</h2>
          <p ref={addToTitleRefs} className="text-sm text-gray-500">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div ref={addToInputRefs} className="group relative transition-all rounded-lg bg-white border border-gray-200">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="email"
              required
              value={email}
              onFocus={() => handleInputFocus(0)}
              onBlur={() => handleInputBlur(0)}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-4 bg-transparent rounded-lg focus:outline-none text-sm placeholder-gray-400 text-gray-900"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div ref={addToInputRefs} className="group relative transition-all rounded-lg bg-white border border-gray-200">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onFocus={() => handleInputFocus(1)}
                  onBlur={() => handleInputBlur(1)}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-4 bg-transparent rounded-lg focus:outline-none text-sm placeholder-gray-400 text-gray-900"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer transition-transform hover:scale-110 active:scale-95"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            
            <div ref={addToTitleRefs} className="flex justify-end">
              <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <button
                ref={buttonRef}
                type="submit"
                disabled={viewState !== "idle"}
                className={`
                    relative overflow-hidden
                    w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg 
                    transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30
                `}
            >
                <div className="relative z-10 flex items-center gap-2">
                    {viewState === "idle" && (
                        <><span>Sign In</span><ArrowRight size={18} /></>
                    )}
                    {viewState === "loading" && (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    {viewState === "success" && (
                        <CheckCircle size={24} className="text-white animate-bounce" />
                    )}
                </div>
            </button>
          </div>
        </form>

        <div ref={addToTitleRefs} className="footer-link mt-8 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
            Sign up for free
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;