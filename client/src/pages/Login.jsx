import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch,  } from "react-redux";
import { setUserData } from "../redux/userSlice";
import toast from "react-hot-toast";

export default function LoginPage() {
  let navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading , setLoading] = useState("")
  let dispatch = useDispatch()
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      let result = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data))
      setEmail("")
      setPassword("")
      setLoading(false)
      toast.success("Logged In Successfully")
    } catch (error) {
      console.log(error);
      setLoading(false)
      toast.error(error.response.data.message)
    }
  };
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const items = useRef([]);
  const glowRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Initial load animations
    tl.fromTo(
      leftRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 1.2, ease: "expo.out" }
    )
      .fromTo(
        rightRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 1.2, ease: "expo.out" },
        "-=1"
      )
      .fromTo(
        items.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      );

    // Subtle floating animation for the background glow
    gsap.to(glowRef.current, {
      x: "20%",
      y: "10%",
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  const add = (el) => {
    if (el && !items.current.includes(el)) items.current.push(el);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#080808] text-white selection:bg-indigo-500/30">
      {/* LEFT SIDE - Hero Visual */}
      <div
        ref={leftRef}
        className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden border-r border-white/5"
      >
        {/* Animated Gradient Glows */}
        <div
          ref={glowRef}
          className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-indigo-600/15 blur-[140px] rounded-full"
        />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full" />

        <div className="relative z-10">
          <div className="w-10 h-10 bg-white rounded-lg mb-12 flex items-center justify-center shadow-xl shadow-white/10">
            <div className="w-5 h-5 bg-black rounded-sm rotate-45" />
          </div>

          <h1 className="text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            Focus on <br />
            <span className="bg-gradient-to-r from-white via-white to-white/30 bg-clip-text text-transparent">
              the details.
            </span>
          </h1>
          <p className="text-xl text-white/40 max-w-sm font-light leading-relaxed">
            The professional standard for modern communication and team
            collaboration.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] text-white/30 font-medium">
          <span className="hover:text-white transition-colors cursor-default">
            Privacy First
          </span>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <span className="hover:text-white transition-colors cursor-default">
            AES-256
          </span>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <span className="hover:text-white transition-colors cursor-default">
            v2.4.0
          </span>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div
        ref={rightRef}
        className="flex items-center justify-center p-8 lg:p-24 relative"
      >
        {/* Mobile Background Accents */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-full bg-indigo-600/5 blur-[100px] -z-10" />

        <div className="w-full max-w-[400px]">
          <div ref={add} className="mb-10">
            <h2 className="text-4xl font-semibold tracking-tight mb-3 text-white">
              Sign in
            </h2>
            <p className="text-white/40 font-light">
              Enter your details to sync your workspace.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div ref={add} className="group">
              <label className="block text-[10px] uppercase tracking-[0.15em] text-white/40 mb-2.5 ml-1 font-bold">
                Work Email
              </label>
              <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
                type="email"
                placeholder="name@company.com"
                className="w-full px-5 py-4 rounded-2xl text-sm bg-white/[0.03] border border-white/10 text-white placeholder:text-white/20 focus:bg-white/[0.06] focus:border-white/30 focus:ring-4 focus:ring-white/5 outline-none transition-all duration-500"
              />
            </div>

            <div ref={add} className="group">
              <div className="flex justify-between items-center mb-2.5 ml-1">
                <label className="block text-[10px] uppercase tracking-[0.15em] text-white/40 font-bold">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[10px] uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot?
                </button>
              </div>
              <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-2xl text-sm bg-white/[0.03] border border-white/10 text-white placeholder:text-white/20 focus:bg-white/[0.06] focus:border-white/30 focus:ring-4 focus:ring-white/5 outline-none transition-all duration-500"
              />
            </div>

            <button
              ref={add}
              className="w-full py-4 mt-4 rounded-2xl bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-[#e5e5e5] active:scale-[0.99] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {loading ? "Loading..." : "Enter Workspace"}
            </button>
          </form>

          {/* Social Proof / Alternative */}
          <div ref={add} className="mt-10 pt-10 border-t border-white/5">
            <button className="w-full py-3.5 rounded-2xl border border-white/10 flex items-center justify-center gap-3 text-sm font-medium hover:bg-white/5 transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>

            <p className="mt-8 text-center text-xs text-white/30 tracking-wide">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-white hover:text-indigo-400 font-semibold transition-colors underline underline-offset-4"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
