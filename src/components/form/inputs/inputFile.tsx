import React, { useState } from "react";
import { InputType } from "@/types/types";
import Image from "next/image";
import CropperModal from "@/components/atoms/croppedImage";

const InputFile: React.FC<InputType> = ({
  id,
  value,
  setValue,
  isOptional,
  property,
  imageOption,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (blob: Blob, dataUrl: string) => {
    const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
    setValue?.(file);
    setPreview(dataUrl);
  };

  return (
    <div className="min-w-52 text-sm">
      <input
        type="file"
        id={id}
        name={property}
        accept="image/*"
        className="w-full text-sm rounded border-none border-foreground bg-gray px-3 py-2 font-light bg-bg-secondary text-foreground focus:border-background focus-visible:outline-none"
        onChange={handleChange}
        required={!value && !isOptional}
      />

      {preview ? (
        <Image
          width={400}
          height={400}
          src={preview}
          alt="Preview"
          onClick={() => {
            if (tempImage == null || tempImage.length < 5)
              setTempImage(preview);
            setShowCropper(true);
          }}
          className="mt-2 max-h-64 object-cover rounded"
        />
      ) : value ? (
        <Image
          width={400}
          height={400}
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${value}`}
          onClick={() => {
            if (tempImage == null || tempImage.length < 5)
              setTempImage(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${value}`);
            setShowCropper(true);
          }}
          alt="Preview"
          className="mt-2 max-h-64 object-cover rounded"
        />
      ) : null}

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

export default InputFile;
