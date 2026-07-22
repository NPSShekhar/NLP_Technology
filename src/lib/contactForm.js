import { useState } from "react";

import {
  getExampleNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js/max";
import examples from "libphonenumber-js/mobile/examples";

export const PHONE_COUNTRY_OPTIONS = [
  { iso: "MY", name: "Malaysia" },
  { iso: "SG", name: "Singapore" },
  { iso: "IN", name: "India" },
  { iso: "US", name: "United States" },
  { iso: "GB", name: "United Kingdom" },
  { iso: "AU", name: "Australia" },
  { iso: "CN", name: "China" },
  { iso: "JP", name: "Japan" },
  { iso: "DE", name: "Germany" },
  { iso: "FR", name: "France" },
  { iso: "ID", name: "Indonesia" },
  { iso: "TH", name: "Thailand" },
  { iso: "PH", name: "Philippines" },
  { iso: "VN", name: "Vietnam" },
  { iso: "KR", name: "South Korea" },
  { iso: "AE", name: "United Arab Emirates" },
];

const initialForm = {
  name: "",
  email: "",
  phoneCountry: "MY",
  phone: "",
  address: "",
  message: "",
  acceptedPrivacy: false,
};

const NAME_PATTERN =
  /^[A-Za-z]+(?: [A-Za-z]+)*$/;

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const countWords = (value = "") => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 0;
  }

  return trimmedValue.split(/\s+/).length;
};

const getCountryLabel = (isoCode) => {
  return (
    PHONE_COUNTRY_OPTIONS.find(
      (country) => country.iso === isoCode
    )?.name || isoCode
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

  const { min, max } = getNationalNumberLengthRange(phoneCountry);

  if (digits.length < min || digits.length > max) {
    return {
      error: `Enter ${min}${min === max ? "" : `-${max}`} digits for ${getCountryLabel(phoneCountry)}`,
      formattedPhone: "",
    };
  }

  const parsed = parsePhoneNumberFromString(
    digits,
    phoneCountry
  );

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
    errors.name =
      "Use letters and spaces only";
  }

  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = "Enter a valid email address";
  }

  const phoneValidation = validatePhoneNumber(
    form.phoneCountry,
    form.phone
  );

  if (phoneValidation.error) {
    errors.phone = phoneValidation.error;
  }

  if (!form.address.trim()) {
    errors.address = "Address is required";
  }

  if (!form.message.trim()) {
    errors.message = "Message is required";
  } else if (countWords(form.message) > 600) {
    errors.message =
      "Message must not exceed 600 words";
  }

  if (!form.acceptedPrivacy) {
    errors.acceptedPrivacy =
      "Please accept the privacy policy to continue";
  }

  return {
    errors,
    formattedPhone: phoneValidation.formattedPhone,
  };
};

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001";

export const useContactEnquiryForm = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (
      name === "name" &&
      value &&
      !/^[A-Za-z ]*$/.test(value)
    ) {
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
    const { max } = getNationalNumberLengthRange(
      form.phoneCountry
    );
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { errors: validationErrors, formattedPhone } =
      validateForm(form);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const response = await fetch(
        `${API_URL}/api/contact-enquiries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: formattedPhone,
            address: form.address.trim(),
            message: form.message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }

        throw new Error(
          data.message ||
            "Unable to submit enquiry."
        );
      }

      setForm(initialForm);
      setErrors({});
      setSubmitted(true);
    } catch (error) {
      console.error(
        "Contact form submission error:",
        error
      );

      setSubmitError(
        error.message ||
          "Unable to submit enquiry."
      );
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
    handleSubmit,
  };
};
