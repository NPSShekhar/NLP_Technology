import { useRef, useState } from "react";
import ReactCrop, { centerCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { getCroppedImageBlob } from "../lib/popupImage";

const toNaturalCrop = (pixelCrop, image) => {
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  return {
    x: Math.round(pixelCrop.x * scaleX),
    y: Math.round(pixelCrop.y * scaleY),
    width: Math.round(pixelCrop.width * scaleX),
    height: Math.round(pixelCrop.height * scaleY),
  };
};

export default function PopupImageCropper({
  imageSrc,
  onCancel,
  onComplete,
}) {
  const imageRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [processing, setProcessing] = useState(false);

  const onImageLoad = (event) => {
    const image = event.currentTarget;
    const { width, height } = image;

    const defaultCrop = centerCrop(
      {
        unit: "%",
        width: 70,
        height: 70,
      },
      width,
      height
    );

    setCrop(defaultCrop);
    setCompletedCrop({
      unit: "px",
      x: (defaultCrop.x / 100) * width,
      y: (defaultCrop.y / 100) * height,
      width: (defaultCrop.width / 100) * width,
      height: (defaultCrop.height / 100) * height,
    });
  };

  const handleApplyCrop = async () => {
    const image = imageRef.current;

    if (
      !image ||
      !completedCrop?.width ||
      !completedCrop?.height
    ) {
      return;
    }

    const cropPixels = toNaturalCrop(completedCrop, image);

    try {
      setProcessing(true);

      const blob = await getCroppedImageBlob(imageSrc, cropPixels);

      const file = new File([blob], "popup-banner.jpg", {
        type: "image/jpeg",
      });

      onComplete({
        file,
        previewUrl: URL.createObjectURL(blob),
        width: cropPixels.width,
        height: cropPixels.height,
      });
    } catch (error) {
      console.error("Crop image error:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 px-4">
      <div className="w-full max-w-[900px] overflow-hidden rounded-[20px] bg-white shadow-xl">
        <div className="border-b border-[#E2E8F0] px-6 py-4">
          <h3 className="font-['Space_Grotesk'] text-[22px] font-bold text-[#2A2E34]">
            Crop banner
          </h3>
          <p className="mt-1 font-['DM_Sans'] text-[14px] text-[#64748B]">
            Drag the crop box or resize from corners and edges to select
            the area you want.
          </p>
        </div>

        <div className="flex max-h-[420px] justify-center overflow-auto bg-[#111827] p-4">
          <ReactCrop
            crop={crop}
            onChange={(_pixelCrop, percentCrop) => setCrop(percentCrop)}
            onComplete={(pixelCrop) => {
              if (pixelCrop.width && pixelCrop.height) {
                setCompletedCrop(pixelCrop);
              }
            }}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop popup banner"
              onLoad={onImageLoad}
              style={{
                display: "block",
                maxHeight: "380px",
                width: "auto",
                maxWidth: "100%",
              }}
            />
          </ReactCrop>
        </div>

        <div className="border-t border-[#E2E8F0] px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-[46px] flex-1 items-center justify-center rounded-[12px] bg-[#FFFFFF] px-6 font-['DM_Sans'] text-[15px] font-semibold text-[#2A2E34] transition hover:bg-[#EEF6FD]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApplyCrop}
              disabled={
                processing ||
                !completedCrop?.width ||
                !completedCrop?.height
              }
              className="inline-flex h-[46px] flex-1 items-center justify-center rounded-[12px] bg-[#00B2F9] px-6 font-['DM_Sans'] text-[15px] font-semibold text-white transition hover:bg-[#0EA5E9] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? "Applying..." : "Apply crop"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
