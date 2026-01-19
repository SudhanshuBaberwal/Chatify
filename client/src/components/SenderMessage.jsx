import React, { useEffect, useRef } from "react";

const SenderMessage = ({ msg, image }) => {
  // Logic: Only render if there is actual content (text OR image)
  if (!msg && !image) return null;

  let scroll = useRef();
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg, image]);
  const handleImageScroll = () => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="flex w-full justify-end chat-bubble group mb-4">
      <div className="max-w-[85%] md:max-w-[65%] flex flex-col items-end">
        <div
          className={`
            relative shadow-lg backdrop-blur-md text-white overflow-hidden
            bg-gradient-to-tr from-indigo-600 to-purple-600 
            border border-white/10 rounded-2xl rounded-br-sm
            ${image ? "p-1.5" : "px-4 py-3 md:px-6 md:py-3.5"}
        `}
        >
          {/* --- 1. IMAGE SECTION --- */}
          {image && (
            <div className="relative rounded-xl overflow-hidden bg-black/20">
              <img onLoad={handleImageScroll}
                src={image}
                alt="attachment"
                className={`w-full h-auto object-cover max-h-[350px] min-w-[150px] ${msg ? "rounded-lg" : "rounded-xl"}`}
              />
              {/* Hover Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}

          {/* --- 2. TEXT SECTION --- */}
          {msg && (
            <div
              ref={scroll}
              className={`
              text-[14px] md:text-[15px] leading-relaxed break-words
              ${image ? "pt-2 px-2 pb-1" : ""} 
            `}
            >
              {msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SenderMessage; 