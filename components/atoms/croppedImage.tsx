import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop";

interface CropperModalProps {
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob, croppedDataUrl: string) => void;
  aspectRatio?: number;
  outputWidth?: number;
  outputHeight?: number;
}

export const getCroppedImg = (
  imageSrc: string,
  crop: Area,
  outputWidth?: number,
  outputHeight?: number
): Promise<{ blob: Blob; dataUrl: string }> => {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");

      const finalWidth = outputWidth ?? crop.width;
      const finalHeight = outputHeight ?? crop.height;

      canvas.width = finalWidth;
      canvas.height = finalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context is null");

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        finalWidth,
        finalHeight
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject("Canvas empty");
        resolve({ blob, dataUrl: canvas.toDataURL("image/jpeg") });
      }, "image/jpeg");
    };
    image.onerror = reject;
  });
};

const CropperModal: React.FC<CropperModalProps> = ({
  imageSrc,
  onClose,
  onCropComplete,
  aspectRatio = 1,
  outputWidth,
  outputHeight,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleCropComplete = useCallback((_: Area, croppedArea: Area) => {
    setCroppedAreaPixels(croppedArea);
  }, []);

  const handleDone = async () => {
    if (!croppedAreaPixels) return;
    const { blob, dataUrl } = await getCroppedImg(
      imageSrc,
      croppedAreaPixels,
      outputWidth,
      outputHeight
    );
    onCropComplete(blob, dataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative w-[90vw] h-[90vh] max-w-[500px] max-h-[500px]">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />

        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="absolute bottom-20 left-0 right-0 w-full mx-auto"
        />

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            type="button"
            onClick={handleDone}
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropperModal;
