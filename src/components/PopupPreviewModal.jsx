export default function PopupPreviewModal({ popup, onClose }) {
  if (!popup) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 px-4">
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-black shadow-lg transition hover:scale-105"
        >
          ×
        </button>

        <img
          src={popup.image}
          alt="Popup preview"
          style={{
            width: `${popup.width}px`,
            height: `${popup.height}px`,
          }}
        />
      </div>
    </div>
  );
}
