import { useLayoutEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

const SESSION_KEY = "popup_banner_seen";

let popupInitStarted = false;

function isReloadNavigation() {
  const [entry] = performance.getEntriesByType("navigation");
  return entry?.type === "reload";
}

function hasPopupBeenSeen() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

function markPopupAsSeen() {
  try {
    sessionStorage.setItem(SESSION_KEY, "true");
  } catch (error) {
    console.error("Failed to save popup session state:", error);
  }
}

export default function PopupBanner() {
  const [popup, setPopup] = useState(null);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    if (popupInitStarted) {
      return;
    }

    popupInitStarted = true;

    if (isReloadNavigation() || hasPopupBeenSeen()) {
      markPopupAsSeen();
      return;
    }

    markPopupAsSeen();

    const fetchActivePopup = async () => {
      try {
        const response = await fetch(`${API_URL}/api/popup/active`);
        const data = await response.json();

        if (!response.ok || !data.success || !data.popup) {
          return;
        }

        setPopup(data.popup);

        setTimeout(() => {
          setVisible(true);
        }, 1200);
      } catch (error) {
        console.error("Fetch active popup error:", error);
      }
    };

    fetchActivePopup();
  }, []);

  const handleClose = () => {
    setVisible(false);
  };

  if (isReloadNavigation() || !popup) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center px-4 transition-all duration-500 ease-out ${
        visible
          ? "bg-black/70 opacity-100"
          : "bg-black/0 opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`relative transform transition-all duration-500 ease-out ${
          visible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close popup"
          className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-black shadow-lg transition hover:scale-105"
        >
          ×
        </button>

        <div className="border-[3px] border-white max-w-full max-h-[90vh] flex">
          <img
            src={popup.image}
            alt="Promotional banner"
            className="max-w-full max-h-[85vh] object-contain"
            style={{
              width: `${popup.width}px`,
              height: "auto",
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
}