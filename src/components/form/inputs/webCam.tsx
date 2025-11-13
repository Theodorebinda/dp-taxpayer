// src/components/Input/InputWebcam.tsx
import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { InputType } from "@/types/types";
import Button from "@/components/commons/button";
import { FaCamera, FaUpload, FaTimes, FaRedo } from "react-icons/fa";
import Image from "next/image";
import { validateImageUrl } from "@/utils/utils";
import CropperModal from "@/components/atoms/croppedImage";

const InputWebcam: React.FC<InputType> = ({ value, setValue, imageOption }) => {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string>();
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);

  const handleDevices = useCallback(
    (mediaDevices: MediaDeviceInfo[]) => {
      const videoDevices = mediaDevices.filter(
        ({ kind }) => kind === "videoinput"
      );
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !deviceId) {
        setDeviceId(videoDevices[0].deviceId);
      }
    },
    [deviceId]
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      triggerCropper(imageSrc);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) triggerCropper(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerCropper = (imageDataUrl: string) => {
    setTempImage(imageDataUrl);
    setShowCropper(true);
  };

  const handleCropComplete = (blob: Blob, dataUrl: string) => {
    const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
    setValue?.(file);
    setPreviewImage(dataUrl);
    setShowCropper(false);
    setTempImage(null);
  };

  const resetImage = () => {
    setPreviewImage(null);
    setValue?.(null);
  };

  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDeviceId(event.target.value);
  };

  const videoConstraints = {
    width: { min: 720, ideal: 1280 },
    height: { min: 720, ideal: 1280 },
    facingMode: "user",
    deviceId: deviceId,
  };

  const imageToDisplay =
    previewImage || (value && validateImageUrl(value as string));

  return (
    <div className="relative">
      {imageToDisplay ? (
        <Image
          width={400}
          height={400}
          src={imageToDisplay}
          alt="Image Preview"
          className="mt-2 object-cover rounded aspect-square"
        />
      ) : (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/png"
          videoConstraints={videoConstraints}
          className="w-[400px] rounded border bg-gray-100 aspect-square object-cover"
        />
      )}

      <div className="mt-2 space-x-2">
        {!imageToDisplay ? (
          <>
            <Button variant="outline" onClick={captureImage}>
              <FaCamera className="inline-block mr-1" />
              Capturer
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <FaUpload className="inline-block mr-1" />
              Uploader
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {devices.length > 1 && (
              <select
                onChange={handleDeviceChange}
                value={deviceId || ""}
                className="border rounded px-2 py-1"
              >
                {devices.map((device, index) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Caméra ${index + 1}`}
                  </option>
                ))}
              </select>
            )}
          </>
        ) : (
          <>
            <Button variant="outline" onClick={resetImage}>
              <FaTimes className="inline-block mr-1" />
              Annuler
            </Button>
            <Button variant="outline" onClick={resetImage}>
              <FaRedo className="inline-block mr-1" />
              Reprendre
            </Button>
          </>
        )}
      </div>

      {showCropper && tempImage && (
        <CropperModal
          imageSrc={tempImage}
          onClose={() => setShowCropper(false)}
          onCropComplete={handleCropComplete}
          aspectRatio={imageOption?.aspectRatio || 1}
        />
      )}
    </div>
  );
};

export default InputWebcam;
