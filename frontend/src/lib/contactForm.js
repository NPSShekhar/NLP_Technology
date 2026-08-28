import { useState } from "react";

import {
  getExampleNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js/max";
import examples from "libphonenumber-js/mobile/examples";

// Country phone digit rules: exact number of digits + dial code
export const countryPhoneRules = {
  "Afghanistan":          { digits: 9,  code: "+93",   iso: "AF" },
  "Albania":              { digits: 9,  code: "+355",  iso: "AL" },
  "Algeria":              { digits: 9,  code: "+213",  iso: "DZ" },
  "Andorra":              { digits: 6,  code: "+376",  iso: "AD" },
  "Angola":               { digits: 9,  code: "+244",  iso: "AO" },
  "Argentina":            { digits: 10, code: "+54",   iso: "AR" },
  "Australia":            { digits: 9,  code: "+61",   iso: "AU" },
  "Austria":              { digits: 10, code: "+43",   iso: "AT" },
  "Bangladesh":           { digits: 10, code: "+880",  iso: "BD" },
  "Belgium":              { digits: 9,  code: "+32",   iso: "BE" },
  "Brazil":               { digits: 11, code: "+55",   iso: "BR" },
  "Canada":               { digits: 10, code: "+1",    iso: "CA" },
  "China":                { digits: 11, code: "+86",   iso: "CN" },
  "Denmark":              { digits: 8,  code: "+45",   iso: "DK" },
  "Egypt":                { digits: 10, code: "+20",   iso: "EG" },
  "Finland":              { digits: 10, code: "+358",  iso: "FI" },
  "France":               { digits: 9,  code: "+33",   iso: "FR" },
  "Germany":              { digits: 10, code: "+49",   iso: "DE" },
  "Greece":               { digits: 10, code: "+30",   iso: "GR" },
  "India":                { digits: 10, code: "+91",   iso: "IN" },
  "Indonesia":            { digits: 10, code: "+62",   iso: "ID" },
  "Iran":                 { digits: 10, code: "+98",   iso: "IR" },
  "Iraq":                 { digits: 10, code: "+964",  iso: "IQ" },
  "Ireland":              { digits: 9,  code: "+353",  iso: "IE" },
  "Italy":                { digits: 10, code: "+39",   iso: "IT" },
  "Japan":                { digits: 10, code: "+81",   iso: "JP" },
  "Malaysia":             { digits: 10, code: "+60",   iso: "MY" },
  "Mexico":               { digits: 10, code: "+52",   iso: "MX" },
  "Nepal":                { digits: 10, code: "+977",  iso: "NP" },
  "Netherlands":          { digits: 9,  code: "+31",   iso: "NL" },
  "New Zealand":          { digits: 9,  code: "+64",   iso: "NZ" },
  "Norway":               { digits: 8,  code: "+47",   iso: "NO" },
  "Pakistan":             { digits: 10, code: "+92",   iso: "PK" },
  "Philippines":          { digits: 10, code: "+63",   iso: "PH" },
  "Poland":               { digits: 9,  code: "+48",   iso: "PL" },
  "Portugal":             { digits: 9,  code: "+351",  iso: "PT" },
  "Russia":               { digits: 10, code: "+7",    iso: "RU" },
  "Saudi Arabia":         { digits: 9,  code: "+966",  iso: "SA" },
  "Singapore":            { digits: 8,  code: "+65",   iso: "SG" },
  "South Africa":         { digits: 9,  code: "+27",   iso: "ZA" },
  "South Korea":          { digits: 10, code: "+82",   iso: "KR" },
  "Spain":                { digits: 9,  code: "+34",   iso: "ES" },
  "Sri Lanka":            { digits: 9,  code: "+94",   iso: "LK" },
  "Sweden":               { digits: 9,  code: "+46",   iso: "SE" },
  "Switzerland":          { digits: 9,  code: "+41",   iso: "CH" },
  "Thailand":             { digits: 9,  code: "+66",   iso: "TH" },
  "Turkey":               { digits: 10, code: "+90",   iso: "TR" },
  "United Arab Emirates": { digits: 9,  code: "+971", iso: "AE" },
  "United Kingdom":       { digits: 10, code: "+44",   iso: "GB" },
  "United States":        { digits: 10, code: "+1",    iso: "US" },
  "Vietnam":              { digits: 9,  code: "+84",   iso: "VN" },
};

export const PHONE_COUNTRY_OPTIONS = Object.entries(countryPhoneRules)
  .map(([name, rule]) => ({
    iso: rule.iso,
    name: name,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const initialForm = {
  name: "",
  email: "",
  phoneCountry: "MY",
  phone: "",
  address: "", // Stores Company Name
  message: "",
  acceptedPrivacy: false,
  file: null,
  captchaVerified: false,
};

const NAME_PATTERN = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const countWords = (value = "") => {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return 0;
  }
  return trimmedValue.split(/\s+/).length;
};

const getCountryLabel = (isoCode) => {
  return (
    PHONE_COUNTRY_OPTIONS.find((country) => country.iso === isoCode)?.name || isoCode
  );
};

const getNationalNumberLengthRange = (isoCode) => {
  try {
    const example = getExampleNumber(isoCode, examples);
    const exampleLength = String(example.nationalNumber).length;
    return {
      min: Math.max(exampleLength - 1, 6),
      max: exampleLength + 1,
    };
  } catch {
    return { min: 6, max: 14 };
  }
};

const validatePhoneNumber = (phoneCountry, phone) => {
  const digits = phone.replace(/\D/g, "");

  if (!digits) {
    return {
      error: "Phone number is required",
      formattedPhone: "",
    };
  }

  const countryLabel = getCountryLabel(phoneCountry);
  const rule = countryPhoneRules[countryLabel];

  if (rule) {
    if (digits.length !== rule.digits) {
      return {
        error: `Enter exactly ${rule.digits} digits for ${countryLabel}`,
        formattedPhone: "",
      };
    }
    return {
      error: "",
      formattedPhone: `${rule.code}${digits}`,
    };
  }

  // Fallback
  const { min, max } = getNationalNumberLengthRange(phoneCountry);
  if (digits.length < min || digits.length > max) {
    return {
      error: `Enter ${min}${min === max ? "" : `-${max}`} digits for ${getCountryLabel(phoneCountry)}`,
      formattedPhone: "",
    };
  }

  const parsed = parsePhoneNumberFromString(digits, phoneCountry);
  if (!parsed || !parsed.isValid()) {
    return {
      error: `Enter a valid phone number for ${getCountryLabel(phoneCountry)}`,
      formattedPhone: "",
    };
  }

  return {
    error: "",
    formattedPhone: parsed.number,
  };
};

const validateForm = (form) => {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Name is required";
  } else if (!NAME_PATTERN.test(form.name.trim())) {
    errors.name = "Use letters and spaces only";
  }

  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  const phoneValidation = validatePhoneNumber(form.phoneCountry, form.phone);
  if (phoneValidation.error) {
    errors.phone = phoneValidation.error;
  }

  if (!form.address.trim()) {
    errors.address = "Company name is required";
  }

  if (!form.message.trim()) {
    errors.message = "Message is required";
  } else if (countWords(form.message) > 600) {
    errors.message = "Message must not exceed 600 words";
  }

  if (!form.acceptedPrivacy) {
    errors.acceptedPrivacy = "Please accept the privacy policy to continue";
  }

  if (!form.captchaVerified) {
    errors.captcha = "Please verify that you are not a robot";
  }

  if (form.file) {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    const fileType = form.file.type || "";
    const fileName = form.file.name || "";
    const extension = fileName.split(".").pop().toLowerCase();
    const isDoc = allowedTypes.includes(fileType) || ["pdf", "doc", "docx", "jpg", "jpeg", "png"].includes(extension);

    if (!isDoc) {
      errors.file = "Invalid file format. Supported formats: PDF, DOC, JPG, PNG";
    } else if (form.file.size > maxSizeBytes) {
      errors.file = "File size must not exceed 10MB";
    }
  }

  return {
    errors,
    formattedPhone: phoneValidation.formattedPhone,
  };
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const useContactEnquiryForm = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "name" && value && !/^[A-Za-z ]*$/.test(value)) {
      return;
    }

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [name]: "",
      }));
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const handlePhoneCountryChange = (event) => {
    const { value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      phoneCountry: value,
      phone: "",
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      phone: "",
    }));

    if (submitError) {
      setSubmitError("");
    }
  };

  const handlePhoneChange = (event) => {
    const digits = event.target.value.replace(/\D/g, "");
    const countryLabel = getCountryLabel(form.phoneCountry);
    const rule = countryPhoneRules[countryLabel];
    const max = rule ? rule.digits : getNationalNumberLengthRange(form.phoneCountry).max;
    const trimmedDigits = digits.slice(0, max);

    setForm((previousForm) => ({
      ...previousForm,
      phone: trimmedDigits,
    }));

    if (errors.phone) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        phone: "",
      }));
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const handlePrivacyChange = (event) => {
    const { checked } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      acceptedPrivacy: checked,
    }));

    if (errors.acceptedPrivacy) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        acceptedPrivacy: "",
      }));
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const handleFileChange = (file) => {
    setForm((previousForm) => ({
      ...previousForm,
      file,
    }));

    if (errors.file) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        file: "",
      }));
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const handleCaptchaChange = (verified) => {
    setForm((previousForm) => ({
      ...previousForm,
      captchaVerified: verified,
    }));

    if (errors.captcha) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        captcha: "",
      }));
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { errors: validationErrors, formattedPhone } = validateForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const apiMessage = form.message.trim() + (form.file ? `\n\n[Attached File: ${form.file.name}]` : "");

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("email", form.email.trim());
      formData.append("phone", formattedPhone);
      formData.append("address", form.address.trim());
      formData.append("message", apiMessage);
      if (form.file) {
        formData.append("file", form.file);
      }

      const response = await fetch(`${API_URL}/api/contact-enquiries`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }

        throw new Error(data.message || "Unable to submit enquiry.");
      }

      setForm(initialForm);
      setErrors({});
      setSubmitted(true);
    } catch (error) {
      console.error("Contact form submission error:", error);
      setSubmitError(error.message || "Unable to submit enquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    errors,
    submitted,
    submitting,
    submitError,
    setSubmitted,
    handleChange,
    handlePhoneCountryChange,
    handlePhoneChange,
    handlePrivacyChange,
    handleFileChange,
    handleCaptchaChange,
    handleSubmit,
  };
};
