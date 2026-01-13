import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignupPage() {
  let navigate = useNavigate();
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading , setLoading] = useState(false)

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      let fullname = `${firstName}${lastName}`;
      let result = await axios.post(
        "http://localhost:3000/api/auth/signup",
        { fullname, email, password },
        { withCredentials: true }
      );
      console.log(result);
      setEmail("")
      setPassword("")
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const items = useRef([]);
  const glowRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

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
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      );

    // Floating animation for the cyan glow
    gsap.to(glowRef.current, {
      scale: 1.2,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  const add = (el) => {
    if (el && !items.current.includes(el)) items.current.push(el);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#080808] text-white selection:bg-cyan-500/30 font-sans">
      {/* LEFT SIDE - Brand Identity */}
      <div
        ref={leftRef}
        className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden border-r border-white/5 bg-[#0a0a0a]"
      >
        {/* Unique Cyan Glow for Signup */}
        <div
          ref={glowRef}
          className="absolute -top-20 -left-20 w-[550px] h-[550px] bg-cyan-600/10 blur-[140px] rounded-full"
        />
        <div className="absolute bottom-20 left-10 w-[200px] h-[200px] bg-emerald-500/5 blur-[100px] rounded-full" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
              <div className="w-4 h-4 bg-black rounded-full" />
            </div>
            <span className="font-bold tracking-tighter text-xl">NEXUS</span>
          </div>

          <h1 className="text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            Experience <br />
            <span className="text-white/40 italic font-medium tracking-tighter">
              clarity.
            </span>
          </h1>
          <p className="text-lg text-white/50 max-w-sm font-light leading-relaxed">
            Join the elite circle of creators and teams who value speed and
            aesthetic precision.
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold">
            <span>Verified Cloud</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>Encrypted Chat</span>
          </div>
          <p className="text-[11px] text-white/10 italic">
            © 2026 Nexus Systems International
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Registration Form */}
      <div
        ref={rightRef}
        className="flex items-center justify-center p-8 lg:p-12 relative overflow-y-auto"
      >
        <div className="w-full max-w-[420px] py-12">
          <div ref={add} className="mb-8">
            <h2 className="text-4xl font-semibold tracking-tight mb-3">
              Create account
            </h2>
            <p className="text-white/40 font-light">
              Start your 14-day premium trial today.
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div ref={add} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">
                  First Name
                </label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  type="text"
                  placeholder="Jane"
                  className="w-full px-4 py-3.5 rounded-xl text-sm bg-white/[0.03] border border-white/10 focus:border-white/40 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">
                  Last Name
                </label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  type="text"
                  placeholder="Doe"
                  className="w-full px-4 py-3.5 rounded-xl text-sm bg-white/[0.03] border border-white/10 focus:border-white/40 outline-none transition-all"
                />
              </div>
            </div>

            <div ref={add} className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                placeholder="jane@studio.com"
                className="w-full px-4 py-3.5 rounded-xl text-sm bg-white/[0.03] border border-white/10 focus:border-white/40 focus:ring-4 focus:ring-white/5 outline-none transition-all duration-300"
              />
            </div>

            <div ref={add} className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-1">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                placeholder="••••••••••••"
                className="w-full px-4 py-3.5 rounded-xl text-sm bg-white/[0.03] border border-white/10 focus:border-white/40 focus:ring-4 focus:ring-white/5 outline-none transition-all duration-300"
              />
            </div>

            <div ref={add} className="flex items-center gap-3 py-2 ml-1">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-white/10 bg-white/5 accent-white"
                id="terms"
              />
              <label
                htmlFor="terms"
                className="text-xs text-white/40 font-light"
              >
                I agree to the{" "}
                <span className="text-white hover:underline cursor-pointer">
                  Terms of Service
                </span>
              </label>
            </div>

            <button
              ref={add}
              className="w-full py-4 mt-2 rounded-2xl bg-white text-black font-bold text-sm uppercase tracking-widest hover:invert transition-all duration-500 shadow-xl shadow-white/5"
            >
              {loading? "Loading....." : "Get Started"}
            </button>
          </form>

          <div
            ref={add}
            className="mt-8 pt-8 border-t border-white/5 text-center"
          >
            <p className="text-sm text-white/40 font-light">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-white font-semibold hover:text-cyan-400 transition-colors underline underline-offset-4"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
