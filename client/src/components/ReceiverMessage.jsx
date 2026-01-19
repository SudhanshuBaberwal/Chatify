import React from "react";

const ReceiverMessage = ({ msg, image }) => {
  if (!msg && !image) return null;

  return (
    <div className="flex w-full justify-start chat-bubble group mb-4">
      
      {/* Avatar (Desktop Only) */}
      <div className="hidden md:block shrink-0 mr-3 self-end mb-6 opacity-70">
        <img
          src={senderImage || "https://via.placeholder.com/40"}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-white/5"
          alt="Sender"
        />
      </div>

      <div className="max-w-[85%] md:max-w-[65%] flex flex-col items-start">
        
        <div className={`
            relative shadow-lg backdrop-blur-md text-gray-100 overflow-hidden
            bg-white/10 md:bg-white/5 
            border border-white/5 rounded-2xl rounded-bl-sm
            ${image ? 'p-1.5' : 'px-4 py-3 md:px-6 md:py-3.5'}
        `}>
          
          {/* --- 1. IMAGE SECTION --- */}
          {image && (
            <div className="relative rounded-xl overflow-hidden bg-black/20">
               <img 
                src={image} 
                alt="attachment" 
                className={`w-full h-auto object-cover max-h-[350px] min-w-[150px] ${msg ? 'rounded-lg' : 'rounded-xl'}`} 
              />
            </div>
          )}

          {/* --- 2. TEXT SECTION --- */}
          {msg && (
            <div className={`
              text-[14px] md:text-[15px] leading-relaxed break-words
              ${image ? 'pt-2 px-2 pb-1' : ''} 
            `}>
              {msg}
            </div>
          )}
        </div>

       
      </div>
    </div>
  );
};

export default ReceiverMessage;