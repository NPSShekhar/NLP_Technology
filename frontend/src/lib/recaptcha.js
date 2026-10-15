const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
let scriptPromise;
const failure = () => new Error("Security verification is unavailable. Please try again or reload the page.");

function withTimeout(promise) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => { timer = setTimeout(() => reject(failure()), 10000); }),
  ]).finally(() => clearTimeout(timer));
}

function loadRecaptcha() {
  if (!siteKey?.trim()) return Promise.reject(failure());
  if (!scriptPromise) {
    scriptPromise = withTimeout(new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
      script.async = true;
      script.onload = () => {
        if (!window.grecaptcha?.ready) return reject(failure());
        window.grecaptcha.ready(() => resolve(window.grecaptcha));
      };
      script.onerror = () => reject(failure());
      document.head.appendChild(script);
    }));
  }
  return scriptPromise;
}

// Execute only on submission. No tokens are retained or reused on retries.
export async function getRecaptchaToken(action) {
  try {
    const captcha = await loadRecaptcha();
    const token = await withTimeout(captcha.execute(siteKey, { action }));
    if (typeof token !== "string" || !token) throw failure();
    return token;
  } catch {
    throw failure();
  }
}
