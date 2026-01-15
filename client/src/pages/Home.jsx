import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MessageArea from "../components/MessageArea";

// --- DUMMY DATA ---
const DUMMY_CONTACTS = [
    { 
        _id: "1", 
        name: "Alice Verse", 
        role: "Quantum Architect",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80", 
        status: "online", 
        time: "10:42 AM", 
        lastMessage: "The rendering coordinates are set." 
    },
    { 
        _id: "2", 
        name: "Bob Cyber", 
        role: "System Admin",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", 
        status: "offline", 
        time: "09:15 AM", 
        lastMessage: "Server reboot scheduled." 
    },
    { 
        _id: "3", 
        name: "Eve Matrix", 
        role: "Security Chief",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80", 
        status: "online", 
        time: "Yesterday", 
        lastMessage: "Unauthorized access blocked." 
    }
];

const INITIAL_MESSAGES = [
    { senderId: "1", text: "Commander, secure channel established.", timestamp: "10:30 AM" },
    { senderId: "me", text: "Affirmative. Send the encryption keys.", timestamp: "10:32 AM" },
];

// --- MAIN COMPONENT ---
const Home = () => {
    const [activeContactId, setActiveContactId] = useState(null); // No chat selected initially
    const [messages, setMessages] = useState([]);
    
    // Current User Profile (You/Me)
    const currentUser = {
        name: "Commander",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
    };

    // --- HANDLERS ---
    const handleSelectContact = (id) => {
        setActiveContactId(id);
        // In a real app, fetch messages from DB here. 
        // For now, we load dummy data:
        setMessages([
            { senderId: id, text: `Connection verified with ${DUMMY_CONTACTS.find(c=>c._id === id).name}.`, timestamp: "Just now" },
            ...INITIAL_MESSAGES
        ]);
    };

    const handleSendMessage = (text) => {
        const newMessage = { 
            senderId: "me", 
            text, 
            timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
        };
        setMessages((prev) => [...prev, newMessage]);
    };

    // Helper to get the full object of the active user
    const activeContact = DUMMY_CONTACTS.find((c) => c._id === activeContactId);

    return (
        /* FIX: Added 'flex h-screen w-full bg-black overflow-hidden' 
           so they sit side-by-side and take up the full window. */
        <div className="flex h-screen w-full bg-black overflow-hidden font-sans">
            
            <Sidebar 
                contacts={DUMMY_CONTACTS}
                activeContactId={activeContactId}
                onSelectContact={handleSelectContact}
                currentUser={currentUser}
            />

            <MessageArea 
                activeContact={activeContact}
                messages={messages}
                onSend={handleSendMessage}
            />

        </div>
    );
}

export default Home;


