import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {setUserData} from "../redux/userSlice";

const Profile = () => {
  let { userData } = useSelector((state) => state.user);
  const [imagePreview, setImagePreview] = useState(userData?.user.image || 
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
  );
  let dispatch = useDispatch();
  console.log(userData.user.fullname)
  let [name, setName] = useState(userData?.user.fullname || "User");
  let [backendImage, setBackendImage] = useState(null);
  let [descripition, setDescripition] = useState(
    userData?.descripition || ""
  );
  let image = useRef();
  let [loading , setLoading] = useState(false)

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      let formData = new FormData();
      formData.append("name", name);
      formData.append("descripition", descripition);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      let result = await axios.put(
        "http://localhost:3000/api/user/profile",
        formData,
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      setLoading(false)
      // Flip back after successful save
      setIsFlipped(false);
    } catch (error) {
      setLoading(false)
      console.log("Error : ", error);
    }
  };

  // Refs
  const mountRef = useRef(null);
  const cardTiltRef = useRef(null);
  const cardFlipRef = useRef(null);

  // State
  const [isFlipped, setIsFlipped] = useState(false);

  // --- 1. NEW BACKGROUND: THE "HOLOGRAPHIC CHAT FEED" ---
  useEffect(() => {
    const currentMount = mountRef.current;

    // Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.02);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    if (currentMount) currentMount.appendChild(renderer.domElement);

    // --- GENERATE CHAT BUBBLES ---
    const bubblesGroup = new THREE.Group();
    scene.add(bubblesGroup);

    // 1. Define Geometry OUTSIDE the loop
    const geometry = new THREE.PlaneGeometry(3, 1.5);

    // 2. Define Materials
    const createBubbleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      // Polyfill for roundRect if needed, though modern browsers support it
      if (ctx.roundRect) {
        ctx.roundRect(4, 4, 120, 56, 20);
      } else {
        ctx.rect(4, 4, 120, 56);
      }
      ctx.fill();

      ctx.fillStyle = "#aaaaaa";
      ctx.fillRect(20, 20, 60, 6);
      ctx.fillRect(20, 35, 40, 6);

      return new THREE.CanvasTexture(canvas);
    };

    const bubbleTexture = createBubbleTexture();
    const materialLeft = new THREE.MeshBasicMaterial({
      map: bubbleTexture,
      transparent: true,
      opacity: 0.1,
      color: 0x8b5cf6,
      side: THREE.DoubleSide,
    });
    const materialRight = new THREE.MeshBasicMaterial({
      map: bubbleTexture,
      transparent: true,
      opacity: 0.1,
      color: 0x06b6d4,
      side: THREE.DoubleSide,
    });

    const bubbles = [];
    const bubbleCount = 60;

    // 3. Create Meshes
    for (let i = 0; i < bubbleCount; i++) {
      const isRight = Math.random() > 0.5;
      const mesh = new THREE.Mesh(
        geometry,
        isRight ? materialRight : materialLeft
      );

      mesh.position.x = (Math.random() - 0.5) * 15;
      mesh.position.y = (Math.random() - 0.5) * 20;
      mesh.position.z = (Math.random() - 0.5) * 10 - 5;

      const scale = Math.random() * 0.5 + 0.5;
      mesh.scale.set(scale, scale, 1);

      mesh.userData = {
        speed: Math.random() * 0.02 + 0.01,
        wobble: Math.random() * 0.1,
      };

      bubbles.push(mesh);
      bubblesGroup.add(mesh);
    }

    // Animation Loop
    const clock = new THREE.Clock();
    let mouseX = 0;
    let mouseY = 0;
    let animationId;

    const animate = () => {
      const time = clock.getElapsedTime();

      bubbles.forEach((bubble, index) => {
        bubble.position.y += bubble.userData.speed;
        bubble.position.x += Math.sin(time + index) * 0.002;

        if (bubble.position.y > 10) {
          bubble.position.y = -10;
          bubble.position.x = (Math.random() - 0.5) * 15;
        }
        bubble.lookAt(camera.position);
      });

      bubblesGroup.rotation.y = mouseX * 0.1;
      bubblesGroup.rotation.x = mouseY * 0.05;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    // Handlers
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    const handleMouseMove = (e) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // --- CLEANUP FUNCTION ---
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);

      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }

      geometry.dispose();
      materialLeft.dispose();
      materialRight.dispose();
      bubbleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  // --- 2. GSAP ENTRANCE ---
  useEffect(() => {
    gsap.to(mountRef.current, { duration: 2, opacity: 1 });
    gsap.fromTo(
      cardTiltRef.current,
      { y: 50, opacity: 0 },
      { duration: 1.2, y: 0, opacity: 1, ease: "power3.out", delay: 0.5 }
    );
  }, []);

  // --- 3. CARD INTERACTIONS ---
  useEffect(() => {
    gsap.to(cardFlipRef.current, {
      duration: 0.8,
      rotationY: isFlipped ? 180 : 0,
      ease: "power4.inOut",
    });
  }, [isFlipped]);

  const handleCardMouseMove = (e) => {
    const card = cardTiltRef.current;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    gsap.to(card, {
      duration: 0.5,
      rotationX: -y / 20,
      rotationY: x / 20,
      transformPerspective: 1000,
      ease: "power2.out",
    });
  };

  const handleCardMouseLeave = () => {
    gsap.to(cardTiltRef.current, {
      duration: 1,
      rotationX: 0,
      rotationY: 0,
      ease: "elastic.out(1, 0.5)",
    });
  };

  // Styles
  const glassStyle = {
    background: "rgba(20, 20, 25, 0.6)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  };

  return (
    <div className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden font-sans text-white flex items-center justify-center">
      {/* BACKGROUND */}
      <div
        ref={mountRef}
        className="absolute top-0 left-0 w-full h-full z-0 opacity-0"
      />

      {/* CARD */}
      <main className="perspective-1000 relative z-10">
        <div
          ref={cardTiltRef}
          className="w-[380px] h-[550px] relative transform-style-3d cursor-default"
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
        >
          <div
            ref={cardFlipRef}
            className="w-full h-full relative transform-style-3d transition-all"
          >
            {/* FRONT (Identity) */}
            <div
              className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden flex flex-col items-center p-8 z-20"
              style={glassStyle}
            >
              <div className="w-32 h-32 rounded-full p-1 border border-white/10 relative mt-8 mb-6 group">
                <div className="absolute inset-0 rounded-full bg-violet-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"></div>
                <img
                  src={imagePreview}
                  className="w-full h-full object-cover rounded-full relative z-10"
                  alt="Avatar"
                />
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-[#1a1a1a] rounded-full z-20"></div>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white/90">
                {name}
              </h2>
              <p className="text-violet-400 text-sm tracking-widest uppercase mb-8 font-medium">
                @{name} • Online
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 w-full border-t border-white/10 pt-6 mb-8">
                <div className="text-center group cursor-pointer">
                  <span className="block text-xl font-bold group-hover:text-violet-400 transition-colors">
                    142
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                    Chats
                  </span>
                </div>
                <div className="text-center group cursor-pointer">
                  <span className="block text-xl font-bold group-hover:text-violet-400 transition-colors">
                    12k
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                    Msgs
                  </span>
                </div>
                <div className="text-center group cursor-pointer">
                  <span className="block text-xl font-bold group-hover:text-violet-400 transition-colors">
                    98%
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                    Reply Rt
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsFlipped(true)}
                className="mt-auto w-full py-3 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-500 transition-all shadow-lg shadow-violet-900/20"
              >
                Edit Profile
              </button>
            </div>

            {/* BACK (Edit) */}
            <div
              className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden p-8 flex flex-col z-10 bg-[#111111]/90"
              style={{ ...glassStyle, transform: "rotateY(180deg)" }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-violet-400">
                  Settings
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFlipped(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* FORM START */}
              <form
                onSubmit={handleProfile}
                className="flex flex-col flex-1 w-full"
              >
                <div className="space-y-4 flex-1">
                  <div className="group">
                    <label className="text-[10px] uppercase text-gray-500 tracking-wider ml-1">
                      Display Name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 outline-none transition-all"
                    />
                  </div>
                  <div className="group">
                    <label className="text-[10px] uppercase text-gray-500 tracking-wider ml-1">
                      Status Message
                    </label>
                    <textarea
                      value={descripition}
                      onChange={(e) => setDescripition(e.target.value)}
                      rows="3"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 outline-none resize-none transition-all"
                    >
                      {descripition}
                    </textarea>
                  </div>
                  <div className="group">
                    <label className="text-[10px] uppercase text-gray-500 tracking-wider ml-1">
                      Profile Photo
                    </label>
                    <label className="flex items-center justify-center w-full h-12 border border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-violet-500/10 transition-all">
                      <span className="text-xs text-gray-400">
                        Upload New Photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        ref={image}
                        className="hidden"
                        onChange={handleImage}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsFlipped(false)}
                    className="flex-1 py-2 rounded-lg border border-white/10 text-xs hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-violet-600 text-white text-xs font-bold hover:bg-violet-500"
                  >
                    {loading?"Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>
              {/* FORM END */}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export default Profile;