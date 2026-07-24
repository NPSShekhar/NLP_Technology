import React, { useState } from "react";
import { User, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import logo from "../assets/nlp_logo.jpg";

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate a tiny delay for a premium feel
    setTimeout(() => {
      const expectedUsername = import.meta.env.VITE_ADMIN_USERNAME;
      const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD;

      if (username === expectedUsername && password === expectedPassword) {
        setError("");
        onLogin();
      } else {
        setError("Invalid username or password");
        setIsSubmitting(false);
      }
    }, 600);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F4F7F9] font-['DM_Sans']">
      {/* Dynamic Background Elements */}
      <div className="pointer-events-none absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#00B2F9]/20 to-[#0EA5E9]/0 blur-[80px]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-gradient-to-tl from-[#2A2E34]/10 to-transparent blur-[100px]" />

      <div className="relative z-10 w-full max-w-[440px] px-4">
        {/* Main Card */}
        <div className="overflow-hidden rounded-[24px] bg-white/80 p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white/50 backdrop-blur-xl">
          
          <div className="mb-9 text-center">
            <div className="mx-auto mb-1 flex h-[80px] w-[180px] items-center justify-center ">
              <img
                src={logo}
                alt="NLP Technology"
                className="h-[50px] w-auto object-contain mix-blend-multiply"
              />
            </div>
            <h1 className="font-['Space_Grotesk'] text-[28px] font-bold tracking-tight text-[#2A2E34]">
              Welcome Back
            </h1>
            <p className="mt-2 text-[15px] sm:text-[17px] md:text-[18px] text-[#64748B]">
              Enter your credentials to access the admin portal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <User className="h-5 w-5 text-[#94A3B8] transition-colors duration-300 group-focus-within:text-[#00B2F9]" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="block w-full rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] py-3.5 pl-11 pr-4 text-[15px] text-[#2A2E34] outline-none transition-all duration-300 placeholder:text-[#94A3B8] hover:bg-white focus:border-[#00B2F9] focus:bg-white focus:ring-4 focus:ring-[#00B2F9]/10"
              />
            </div>

            {/* Password Input */}
            <div className="group relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-[#94A3B8] transition-colors duration-300 group-focus-within:text-[#00B2F9]" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="block w-full rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] py-3.5 pl-11 pr-12 text-[15px] text-[#2A2E34] outline-none transition-all duration-300 placeholder:text-[#94A3B8] hover:bg-white focus:border-[#00B2F9] focus:bg-white focus:ring-4 focus:ring-[#00B2F9]/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#94A3B8] transition-colors hover:text-[#2A2E34] focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Error Message */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${error ? "h-6 opacity-100" : "h-0 opacity-0"}`}>
              <p className="text-center text-[13px] font-medium text-red-500">
                {error}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-[14px] bg-[#2A2E34] py-4 text-[16px] font-semibold text-white transition-all duration-300 hover:bg-[#1A1D21] hover:shadow-lg hover:shadow-[#2A2E34]/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-80"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isSubmitting ? "Authenticating..." : "Sign In"}
                {!isSubmitting && (
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </span>
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-[13px] text-[#94A3B8]">
              Secure Admin Portal © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
