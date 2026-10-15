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
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryMenuStyle, setCountryMenuStyle] = useState({});
  const countryButtonRef = useRef(null);
  const countryMenuRef = useRef(null);

  const updateCountryMenuPosition = () => {
    if (!countryButtonRef.current) return;

    const rect = countryButtonRef.current.getBoundingClientRect();
    const viewportPadding = 8;

    // Reduced dropdown height
    const menuHeight = Math.min(300, PHONE_COUNTRY_OPTIONS.length * 38);

    const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
    const spaceAbove = rect.top - viewportPadding;

    // Open upward if there isn't enough space below
    const openUpward =
      spaceBelow < menuHeight && spaceAbove > spaceBelow;

    const availableHeight = Math.max(
      120,
      Math.min(
        menuHeight,
        openUpward ? spaceAbove : spaceBelow
      )
    );

    setCountryMenuStyle({
      position: "fixed",
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      maxHeight: `${availableHeight}px`,
      ...(openUpward
        ? {
            bottom: `${window.innerHeight - rect.top + 4}px`,
          }
        : {
            top: `${rect.bottom + 4}px`,
          }),
    });
  };

  const handleCountryToggle = () => {
    setCountryOpen((open) => {
      if (!open) {
        requestAnimationFrame(updateCountryMenuPosition);
      }

      return !open;
    });
  };

  const handleCountrySelect = (country) => {
    onCountryChange({
      target: {
        name: "phoneCountry",
        value: country.iso,
      },
    });

    setCountryOpen(false);
  };

  useEffect(() => {
    if (!countryOpen) return;

    const handleOutsideClick = (event) => {
      if (
        countryButtonRef.current?.contains(event.target) ||
        countryMenuRef.current?.contains(event.target)
      ) {
        return;
      }

      setCountryOpen(false);
    };

    const handleViewportChange = () => {
      updateCountryMenuPosition();
    };

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [countryOpen]);

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
          <button
            ref={countryButtonRef}
            type="button"
            id={`${idPrefix}-phone-country`}
            aria-label="Country code"
            aria-haspopup="listbox"
            aria-expanded={countryOpen}
            onClick={handleCountryToggle}
            className={`appearance-none w-full h-[44px] rounded-[7px] border bg-[#FFFFFF] pl-3 pr-10 text-left font-['DM_Sans'] text-[13px] md:text-[14px] outline-none ${
              errors.phone
                ? "border-red-500"
                : "border-[#C9D3DF] focus:border-[#00B2F9]"
            } ${selectClassName}`}
          >
            +{callingCode} {form.phoneCountry}
          </button>

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

          {countryOpen &&
            createPortal(
              <div
                ref={countryMenuRef}
                role="listbox"
                aria-label="Country codes"
                style={countryMenuStyle}
                className="z-[9999] overflow-y-auto rounded-[4px] border border-[#C9D3DF] bg-white shadow-lg font-['DM_Sans']"
              >
                {PHONE_COUNTRY_OPTIONS.map((country) => {
                  const countryCode = getCountryCallingCode(country.iso);
                  const isSelected =
                    form.phoneCountry === country.iso;

                  return (
                    <button
                      key={country.iso}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() =>
                        handleCountrySelect(country)
                      }
                      className={`block w-full h-[38px] px-3 text-left text-[13px] md:text-[14px] whitespace-nowrap ${
                        isSelected
                          ? "bg-[#0B63CE] text-white"
                          : "bg-white text-[#1F2937] hover:bg-[#EEF6FD]"
                      }`}
                    >
                      +{countryCode} {country.iso}
                    </button>
                  );
                })}
              </div>,
              document.body
            )}
        </div>

        <input
          type="tel"
          id={`${idPrefix}-phone`}
          name="phone"
          value={form.phone}
          onChange={onPhoneChange}
          placeholder={`Example: ${
            callingCode === "60"
              ? "123456789"
              : "1234567890"
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

    if (
      e.dataTransfer.files &&
      e.dataTransfer.files[0]
    ) {
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
    const i = Math.floor(
      Math.log(bytes) / Math.log(k)
    );

    return (
      parseFloat(
        (bytes / Math.pow(k, i)).toFixed(2)
      ) +
      " " +
      sizes[i]
    );
  };

  return (
    <div
      className={`flex flex-col gap-2 w-full ${className}`}
    >
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
                Drag & drop files here or{" "}
                <span className="text-[#0EA5E9] hover:underline">
                  click to browse
                </span>
              </p>

              <p className="text-[12px] md:text-[13px] lg:text-[14px] text-[#64748B] mt-1">
                Supported formats: PDF, DOC, JPG, PNG
                (Max 10MB)
              </p>
            </div>
          </>
        ) : (
          <div
            className="flex items-center justify-between w-full max-w-[400px] bg-white border border-[#E2E8F0] rounded-lg p-3 shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
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

export function SuccessPopupModal({
  isOpen,
  onClose,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow =
        "hidden";

      document.documentElement.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow =
        "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow =
        "";
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
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h3 className="font-['Space_Grotesk'] font-bold text-[24px] md:text-[26px] lg:text-[27px] text-[#1E293B]">
          Request Sent!
        </h3>

        <p className="mt-4 font-['DM_Sans'] text-[16px] md:text-[17px] lg:text-[18px] text-[#64748B] max-w-[320px]">
          Thank you for reaching out. Our team will review your details and
          contact you within one business day.
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
