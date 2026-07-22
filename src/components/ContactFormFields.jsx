import { getCountryCallingCode } from "libphonenumber-js/max";
import { PHONE_COUNTRY_OPTIONS } from "../lib/contactForm";

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
  textClassName = "text-[#64748B]",
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