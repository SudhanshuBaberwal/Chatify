import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const EmailVerification = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  // Safe fallback if email isn't passed in state
  const email = location.state?.email || "your email";

  // Auto-focus the first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle input change (typing)
  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle Paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.split("");
    const newCode = [...code];

    digits.forEach((digit, index) => {
      newCode[index] = digit;
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = digit;
      }
    });

    setCode(newCode);

    const focusIndex = digits.length < 6 ? digits.length : 5;
    inputRefs.current[focusIndex].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const verificationCode = code.join("");
    
    if (verificationCode.length !== 6) {
      toast.error("Enter Valid Code");
      setLoading(false);
      return;
    }

    try {
      const result = await axios.post(
        "http://localhost:3000/api/auth/verifyEmail",
        { verificationCode },
        { withCredentials: true }
      );
      
      dispatch(setUserData(result.data));
      toast.success("Email Verified Successfully!");
      setLoading(false);
      navigate("/profile");
      
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4">
      
      {/* Glass/Card Container */}
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-12">
        
        {/* Header Section */}
        <div className="text-center sm:text-left mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Verify account
          </h1>
          <p className="mt-2 text-gray-500">
            We've sent a 6-digit security code to <br className="hidden sm:block"/>
            <span className="font-semibold text-gray-900">{email}</span>
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2 mb-8">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                inputMode="numeric"
                pattern="[0-9]*"
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={loading}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold text-gray-900 bg-gray-100 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-200 disabled:opacity-50"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg transform transition-all duration-200 
              ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-black hover:scale-[1.01] active:scale-[0.98]"} 
              focus:outline-none focus:ring-4 focus:ring-gray-900/30 flex justify-center items-center gap-2`}
          >
             {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
             ) : (
                "Verify Email"
             )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center sm:text-left">
          <p className="text-sm text-gray-500">
            Didn't receive the code?{' '}
            <button 
              type="button"
              onClick={() => {
                alert("Trigger Resend API here");
                // TODO: Add your resend API call logic here
              }}
              className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors bg-transparent border-none cursor-pointer"
            >
              Resend Code
            </button>
          </p>
          <p className="mt-8 text-xs text-gray-400 text-center">
            Secure 256-bit Encrypted Connection
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;