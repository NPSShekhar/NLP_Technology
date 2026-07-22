const {
  parsePhoneNumberFromString,
} = require("libphonenumber-js/max");

const NAME_PATTERN = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const countWords = (value = "") => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return 0;
  }

  return trimmedValue.split(/\s+/).length;
};

const validateContactPayload = (payload = {}) => {
  const data = {
    name: String(payload.name || "").trim(),
    email: String(payload.email || "")
      .trim()
      .toLowerCase(),
    phone: String(payload.phone || "").trim(),
    address: String(payload.address || "").trim(),
    message: String(payload.message || "").trim(),
  };

  const errors = {};

  if (!data.name) {
    errors.name = "Name is required.";
  } else if (!NAME_PATTERN.test(data.name)) {
    errors.name =
      "Name must contain letters and spaces only.";
  } else if (data.name.length > 150) {
    errors.name =
      "Name must be less than 150 characters.";
  }

  if (!data.email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(data.email)) {
    errors.email = "Enter a valid email address.";
  } else if (data.email.length > 255) {
    errors.email = "Email address is too long.";
  }

  if (!data.phone) {
    errors.phone = "Phone number is required.";
  } else if (!data.phone.startsWith("+")) {
    errors.phone =
      "Phone number must include country code, for example +60123456789.";
  } else {
    const phoneNumber =
      parsePhoneNumberFromString(data.phone);

    if (!phoneNumber || !phoneNumber.isValid()) {
      errors.phone =
        "Enter a valid phone number with country code.";
    } else {
      data.phone = phoneNumber.number;
    }
  }

  if (!data.address) {
    errors.address = "Address is required.";
  }

  if (!data.message) {
    errors.message = "Message is required.";
  } else {
    const wordCount = countWords(data.message);

    if (wordCount > 600) {
      errors.message =
        "Message must not exceed 600 words.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data,
  };
};

module.exports = {
  validateContactPayload,
};