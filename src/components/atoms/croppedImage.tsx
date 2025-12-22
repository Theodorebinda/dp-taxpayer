import React, { useState, useCallback, useMemo, memo } from "react";
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

  const handleCropChange = useCallback((newCrop: { x: number; y: number }) => {
    setCrop(newCrop);
  }, []);

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const handleDone = useCallback(async () => {
    if (!croppedAreaPixels) return;
    try {
      const { blob, dataUrl } = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        outputWidth,
        outputHeight
      );
      onCropComplete(blob, dataUrl);
      onClose();
    } catch (error) {
      console.error("Erreur lors du recadrage:", error);
    }
  }, [
    croppedAreaPixels,
    imageSrc,
    outputWidth,
    outputHeight,
    onCropComplete,
    onClose,
  ]);

  const handleZoomInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setZoom(Number(e.target.value));
    },
    []
  );

  const containerStyle = useMemo(
    () => ({
      willChange: "transform" as const,
      transform: "translateZ(0)" as const,
    }),
    []
  );

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={containerStyle}
    >
      <div
        className="relative w-[90vw] h-[90vh] max-w-[500px] max-h-[500px] bg-background rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={containerStyle}
      >
        <div
          className="relative w-full h-full"
          style={{ willChange: "transform" }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={handleCropChange}
            onZoomChange={handleZoomChange}
            onCropComplete={handleCropComplete}
            restrictPosition={true}
            showGrid={false}
            style={{
              containerStyle: {
                willChange: "transform",
              },
            }}
          />
        </div>

        <div className="absolute bottom-20 left-0 right-0 px-4 z-10">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={handleZoomInputChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            style={{ willChange: "auto" }}
          />
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-4 z-10">
          <button
            type="button"
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
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

export default memo(CropperModal);
