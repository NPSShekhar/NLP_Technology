import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { getCountryCallingCode } from "libphonenumber-js/max";
import { PHONE_COUNTRY_OPTIONS } from "../lib/contactForm";
import uploadIcon from "../assets/upload-icon.png";

export function ContactPhoneField({
  idPrefix,
  form,
  errors,
  onCountryChange,
  onPhoneChange,
  inputClassName = "",
  selectClassName = "",
  className = "",
}) {
  const callingCode = getCountryCallingCode(form.phoneCountry);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label
        htmlFor={`${idPrefix}-phone`}
        className="text-[17px] md:text-[18px] lg:text-[19px] font-['DM_Sans'] font-medium text-[#2A2E34]"
      >
        Phone <span className="text-red-500">*</span>
      </label>

      <div className="flex gap-2">
        <div className="relative min-w-[58px] max-w-[100px] shrink-0">
          <select
            id={`${idPrefix}-phone-country`}
            name="phoneCountry"
            value={form.phoneCountry}
            onChange={onCountryChange}
            aria-label="Country code"
            className={`appearance-none w-full h-[44px] rounded-[7px] border bg-[#FFFFFF] pl-3 pr-10 font-['DM_Sans'] text-[13px] md:text-[14px] outline-none ${
              errors.phone
                ? "border-red-500"
                : "border-[#C9D3DF] focus:border-[#00B2F9]"
            } ${selectClassName}`}
          >
            {PHONE_COUNTRY_OPTIONS.map((country) => (
              <option key={country.iso} value={country.iso}>
                +{getCountryCallingCode(country.iso)} {country.iso}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg
              className="w-4 h-4 text-[#6B7280]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <input
          type="tel"
          id={`${idPrefix}-phone`}
          name="phone"
          value={form.phone}
          onChange={onPhoneChange}
          placeholder={`Example: ${
            callingCode === "60" ? "123456789" : "1234567890"
          }`}
          autoComplete="tel-national"
          inputMode="numeric"
          className={`contact-input w-full h-[44px] px-4 rounded-[7px] border bg-[#FFFFFF] outline-none font-['DM_Sans'] text-[14px] md:text-[15px] lg:text-[16px] placeholder:text-[#BEC8D2] ${
            errors.phone
              ? "border-red-500"
              : "border-[#C9D3DF] focus:border-[#00B2F9]"
          } ${inputClassName}`}
        />
      </div>

      {errors.phone && (
        <span className="text-red-500 text-[11px] font-['DM_Sans']">
          {errors.phone}
        </span>
      )}
    </div>
  );
}

export function ContactPrivacyCheckbox({
  idPrefix,
  form,
  errors,
  onChange,
  textClassName = "text-[#2A2E34]",
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={`${idPrefix}-privacy-policy`}
        className="flex cursor-pointer items-start gap-3"
      >
        <input
          type="checkbox"
          id={`${idPrefix}-privacy-policy`}
          name="acceptedPrivacy"
          checked={form.acceptedPrivacy}
          onChange={onChange}
          className="mt-1 h-4 w-4 shrink-0 rounded border border-[#94A3B8] accent-[#00B2F9]"
        />

        <span
          className={`font-['DM_Sans'] text-[14px] md:text-[15px] leading-relaxed ${textClassName}`}
        >
          By continuing, you accept the privacy policy
        </span>
      </label>

      {errors.acceptedPrivacy && (
        <span className="text-red-500 text-[11px] font-['DM_Sans']">
          {errors.acceptedPrivacy}
        </span>
      )}
    </div>
  );
}

export function ContactFileUploader({
  form,
  errors,
  onFileChange,
  className = "",
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <label className="text-[17px] md:text-[18px] lg:text-[19px] font-['DM_Sans'] font-medium text-[#2A2E34]">
        Upload File
      </label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        className={`w-full min-h-[140px] border-2 border-dashed rounded-[10px] p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-[#00B2F9] bg-[#EEF6FD]"
            : errors.file
            ? "border-red-500 bg-red-50/10"
            : "border-[#C9D3DF] hover:border-[#00B2F9] hover:bg-[#F8FAFC]"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />

        {!form.file ? (
          <>
            <div className="w-8 h-8 rounded-full bg-[#E0F2FE] flex items-center justify-center text-[#0284C7]">
           <img
    src={uploadIcon}
    alt="Upload"
    className="w-5 h-5 object-contain"
  />
            </div>

            <div className="text-center font-['DM_Sans']">
              <p className="text-[14px] md:text-[15px] lg:text-[16px] font-medium text-[#334155]">
                Drag & drop files here or <span className="text-[#0EA5E9] hover:underline">click to browse</span>
              </p>
              <p className="text-[12px] md:text-[13px] lg:text-[14px] text-[#64748B] mt-1">
                Supported formats: PDF, DOC, JPG, PNG (Max 10MB)
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between w-full max-w-[400px] bg-white border border-[#E2E8F0] rounded-lg p-3 shadow-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              <div className="text-left overflow-hidden">
                <p className="text-[13px] font-medium text-[#1E293B] truncate font-['DM_Sans']">
                  {form.file.name}
                </p>
                <p className="text-[11px] text-[#64748B] font-['DM_Sans']">
                  {formatFileSize(form.file.size)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-[#94A3B8] hover:text-[#EF4444] transition-colors p-1"
              aria-label="Remove file"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {errors.file && (
        <span className="text-red-500 text-[11px] font-['DM_Sans']">
          {errors.file}
        </span>
      )}
    </div>
  );
}

// Generates alphanumeric captcha characters (letters + digits like image 1: "A8 83 2")
function generateCaptchaString() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function drawCaptchaToCanvas(canvas, code) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  // Background
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#F1F5F9";
  ctx.fillRect(0, 0, w, h);

  // Grid lines (like image 1)
  ctx.strokeStyle = "rgba(180,195,210,0.55)";
  ctx.lineWidth = 0.8;
  for (let x = 0; x < w; x += 10) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 10) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // Noise dots
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgba(100,120,140,${Math.random() * 0.25 + 0.1})`;
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Characters
  ctx.textBaseline = "middle";
  const segW = w / (code.length + 0.5);
  code.split("").forEach((ch, i) => {
    const x = segW * (i + 0.65) + (Math.random() - 0.5) * 6;
    const y = h / 2 + (Math.random() - 0.5) * 8;
    const size = 22 + Math.random() * 7;
    const angle = (Math.random() - 0.5) * 0.35;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.font = `bold ${size}px "Courier New", Courier, monospace`;
    ctx.fillStyle = `rgba(30,41,59,${0.8 + Math.random() * 0.2})`;
    ctx.shadowColor = "rgba(0,0,0,0.12)";
    ctx.shadowBlur = 2;
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });
}

export function ContactInlineCaptcha({
  onVerify,
  captchaVerified,
  errors,
  className = "",
}) {
  const [code, setCode] = useState(() => generateCaptchaString());
  const [userInput, setUserInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    drawCaptchaToCanvas(canvasRef.current, code);
  }, [code]);

  useEffect(() => {
    // Parent form reset or submission successful sets captchaVerified to false
    if (!captchaVerified && userInput.length > 0) {
      setCode(generateCaptchaString());
      setUserInput("");
      setErrorMsg("");
    }
  }, [captchaVerified]);

  const refresh = () => {
    setCode(generateCaptchaString());
    setUserInput("");
    setErrorMsg("");
    onVerify(false);
  };

const validate = () => {
  if (!userInput.trim()) {
    setErrorMsg("Please enter the characters shown.");
    onVerify(false);
    return;
  }

  if (userInput.trim().toUpperCase() === code) {
    setErrorMsg("");
    onVerify(true);
  } else {
    setErrorMsg("Incorrect captcha. Please try again.");
    onVerify(false);

    // Refresh only the captcha image
    setCode(generateCaptchaString());

    // Clear the input field
    setUserInput("");
  }
};
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <label className="text-[17px] md:text-[18px] lg:text-[19px] font-['DM_Sans'] font-medium text-[#2A2E34]">
        Captcha <span className="text-red-500">*</span>
      </label>

      {/* Mobile: 3 rows using flex order. md+: single row */}
      <div className="flex flex-col md:flex-row md:items-center gap-2">

        {/* Part A (Row 2 on mobile, Left on desktop): Text input */}
        <input
          type="text"
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value.toUpperCase().slice(0, 5));
            setErrorMsg("");
            if (captchaVerified) onVerify(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); validate(); }
          }}
          placeholder="Enter Captcha"
          maxLength={5}
          className={`order-2 md:order-1 w-full md:flex-1 md:min-w-0 h-[44px] border rounded-[7px] px-4 font-['DM_Sans'] placeholder:text-[13px] placeholder:font-normal text-[15px] font-bold tracking-[2px] text-[#1E293B] outline-none bg-white ${
            errors.captcha && !captchaVerified
              ? "border-red-500"
              : captchaVerified
              ? "border-green-500"
              : "border-[#C9D3DF] focus:border-[#00B2F9]"
          }`}
        />

        {/* Part B (Row 1 on mobile, Middle on desktop): Canvas + Refresh */}
        <div className="flex items-center gap-2 order-1 md:order-2">
          {/* Canvas — wider */}
          <canvas
            ref={canvasRef}
            width={150}
            height={44}
            className="rounded-[7px] border border-[#C9D3DF] shrink-0"
            style={{ width: "150px", height: "44px" }}
          />

          {/* Refresh button */}
          <button
            type="button"
            onClick={refresh}
            title="Refresh"
            className="shrink-0 p-1.5 text-[#64748B] hover:text-[#00B2F9] hover:bg-[#EEF6FD] rounded-md transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Part C (Row 3 on mobile, Right on desktop): Verify / Verified */}
        {!captchaVerified ? (
          <button
            type="button"
            onClick={validate}
            className="order-3 md:order-3 shrink-0 self-start md:self-auto h-[44px] px-6 md:px-4 w-fit md:w-[90px] bg-[#FFFFFF] border border-[#C9D3DF] hover:bg-[#0EA5E9] hover:text-[#FFFFFF] text-black font-['DM_Sans'] font-medium text-[16px] rounded-[12px] transition-all active:scale-95 shadow-sm whitespace-nowrap"
          >
            Verify
          </button>
        ) : (
          <p className="order-3 md:order-3 shrink-0 self-start md:self-auto h-[44px] px-6 md:px-3 w-fit md:w-[80px] flex items-center justify-center gap-1 text-green-600 text-[14px] font-['DM_Sans'] border border-green-500 bg-[#FFFFFF] rounded-[12px] font-semibold whitespace-nowrap">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>Verified</span>
          </p>
        )}

      </div>

  

      {errorMsg && (
        <span className="text-red-500 text-[12px] font-['DM_Sans']">{errorMsg}</span>
      )}
      {errors.captcha && !captchaVerified && !errorMsg && (
        <span className="text-red-500 text-[12px] font-['DM_Sans']">{errors.captcha}</span>
      )}
    </div>
  );
}

export function SuccessPopupModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4 transition-opacity" 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[420px] bg-[#FFFFFF] rounded-[10px] p-8 md:p-10 shadow-xl text-center flex flex-col items-center justify-center animate-[popIn_0.2s_ease_forwards] relative z-[201]"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 className="font-['Space_Grotesk'] font-bold text-[24px] md:text-[26px] lg:text-[27px] text-[#1E293B]">
          Request Sent!
        </h3>

        <p className="mt-4 font-['DM_Sans'] text-[14px] md:text-[15px] lg:text-[16px] text-[#64748B] max-w-[320px]">
          Thank you for reaching out. Our team will review your details and contact you within one business day.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-8 px-6 py-2 border border-[#0EA5E9] text-[#0EA5E9] rounded-md text-[14px] md:text-[15px] font-medium hover:bg-[#0EA5E9] hover:text-white font-['DM_Sans'] transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    </div>,
    document.body
  );
}