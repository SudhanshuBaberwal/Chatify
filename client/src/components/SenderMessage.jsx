import React from "react";

const SenderMessage = ({ msg }) => {
    return (
        <div className="flex w-full justify-end chat-bubble group mb-4">
            <div className="max-w-[85%] md:max-w-[70%] flex flex-col items-end">
                <div className="
                    relative px-4 py-3 md:px-6 md:py-3.5 
                    text-[14px] md:text-[15px] leading-relaxed 
                    text-white shadow-lg backdrop-blur-md
                    bg-gradient-to-tr from-indigo-600 to-purple-600 
                    border border-white/10
                    rounded-2xl rounded-br-sm
                ">
                    {msg.text}
                </div>
                <span className="text-[10px] mt-1 md:mt-2 text-white/50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity font-medium px-1">
                    {msg.time}
                </span>
            </div>
        </div>
    );
};

export default SenderMessage;