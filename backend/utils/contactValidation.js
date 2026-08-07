const {
  parsePhoneNumberFromString,
} = require("libphonenumber-js/max");

const NAME_PATTERN = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const countryPhoneRules = {
  "Afghanistan":          { digits: 9,  code: "+93"  },
  "Albania":              { digits: 9,  code: "+355" },
  "Algeria":              { digits: 9,  code: "+213" },
  "Andorra":              { digits: 6,  code: "+376" },
  "Angola":               { digits: 9,  code: "+244" },
  "Argentina":            { digits: 10, code: "+54"  },
  "Australia":            { digits: 9,  code: "+61"  },
  "Austria":              { digits: 10, code: "+43"  },
  "Bangladesh":           { digits: 10, code: "+880" },
  "Belgium":              { digits: 9,  code: "+32"  },
  "Brazil":               { digits: 11, code: "+55"  },
  "Canada":               { digits: 10, code: "+1"   },
  "China":                { digits: 11, code: "+86"  },
  "Denmark":              { digits: 8,  code: "+45"  },
  "Egypt":                { digits: 10, code: "+20"  },
  "Finland":              { digits: 10, code: "+358" },
  "France":               { digits: 9,  code: "+33"  },
  "Germany":              { digits: 10, code: "+49"  },
  "Greece":               { digits: 10, code: "+30"  },
  "India":                { digits: 10, code: "+91"  },
  "Indonesia":            { digits: 10, code: "+62"  },
  "Iran":                 { digits: 10, code: "+98"  },
  "Iraq":                 { digits: 10, code: "+964" },
  "Ireland":              { digits: 9,  code: "+353" },
  "Italy":                { digits: 10, code: "+39"  },
  "Japan":                { digits: 10, code: "+81"  },
  "Malaysia":             { digits: 10, code: "+60"  },
  "Mexico":               { digits: 10, code: "+52"  },
  "Nepal":                { digits: 10, code: "+977" },
  "Netherlands":          { digits: 9,  code: "+31"  },
  "New Zealand":          { digits: 9,  code: "+64"  },
  "Norway":               { digits: 8,  code: "+47"  },
  "Pakistan":             { digits: 10, code: "+92"  },
  "Philippines":          { digits: 10, code: "+63"  },
  "Poland":               { digits: 9,  code: "+48"  },
  "Portugal":             { digits: 9,  code: "+351" },
  "Russia":               { digits: 10, code: "+7"   },
  "Saudi Arabia":         { digits: 9,  code: "+966" },
  "Singapore":            { digits: 8,  code: "+65"  },
  "South Africa":         { digits: 9,  code: "+27"  },
  "South Korea":          { digits: 10, code: "+82"  },
  "Spain":                { digits: 9,  code: "+34"  },
  "Sri Lanka":            { digits: 9,  code: "+94"  },
  "Sweden":               { digits: 9,  code: "+46"  },
  "Switzerland":          { digits: 9,  code: "+41"  },
  "Thailand":             { digits: 9,  code: "+66"  },
  "Turkey":               { digits: 10, code: "+90"  },
  "United Arab Emirates": { digits: 9,  code: "+971" },
  "United Kingdom":     { digits: 10, code: "+44"  },
  "United States":      { digits: 10, code: "+1"   },
  "Vietnam":            { digits: 9,  code: "+84"  },
};

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
    // Sort rules by code length descending to match longest code first
    const sortedRules = Object.entries(countryPhoneRules).sort(
      (a, b) => b[1].code.length - a[1].code.length
    );

    let matchedRule = null;
    let nationalNumber = "";

    for (const [countryName, rule] of sortedRules) {
      if (data.phone.startsWith(rule.code)) {
        matchedRule = rule;
        nationalNumber = data.phone.slice(rule.code.length);
        break;
      }
    }

    if (matchedRule) {
      if (nationalNumber.length !== matchedRule.digits) {
        errors.phone = `Enter exactly ${matchedRule.digits} digits for the phone number.`;
      }
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
  }

  if (!data.address) {
    errors.address = "Company name is required.";
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