import React from "react";

const ReceiverMessage = ({ msg, userImage }) => {
    return (
        <div className="flex w-full justify-start chat-bubble group mb-4">
            {/* Avatar: Hidden on Mobile, Visible on Desktop */}
            <div className="hidden md:block shrink-0 mr-3 self-end mb-6 opacity-70">
                <img 
                    src={userImage || "https://via.placeholder.com/40"} 
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white/5" 
                    alt="User" 
                />
            </div>

            <div className="max-w-[85%] md:max-w-[70%] flex flex-col items-start">
                <div className="
                    relative px-4 py-3 md:px-6 md:py-3.5 
                    text-[14px] md:text-[15px] leading-relaxed 
                    text-gray-100 shadow-lg backdrop-blur-md
                    bg-white/10 md:bg-white/5 
                    border border-white/5
                    rounded-2xl rounded-bl-sm
                ">
                    {msg.text}
                </div>
                <span className="text-[10px] mt-1 md:mt-2 text-white/30 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity font-medium px-1">
                    {msg.time}
                </span>
            </div>
        </div>
    );
};

export default ReceiverMessage;