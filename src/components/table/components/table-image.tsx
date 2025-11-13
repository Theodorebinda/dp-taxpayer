import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react"; // Icône pour image non chargée
import Link from "next/link";

const ImageWithFallback = ({
  src,
  alt,
  width = 100,
  height = 100,
  className = "",
  displayLinkOnError = false,
}: {
  src: string | null;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  displayLinkOnError?: boolean;
}) => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`${className} max-h-full`}>
      {error || src == "" || src == null ? (
        src == "" || src == null || (error && !displayLinkOnError) ? (
          <div
            style={{ width: width, height: height }}
            className={`flex items-center justify-center bg-bg-secondary rounded-md`}
          >
            <ImageOff className="w-6 h-16 text-background" />
          </div>
        ) : (
          <Link className="text-primary underline" target="_blank" href={src}>
            {src}
          </Link>
        )
      ) : (
        <>
          {isLoading && (
            <div
              className="inset-0 flex items-center justify-center bg-bg-secondary rounded-md"
              style={{ width: `${width}px`, height: `${height}px` }}
            >
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <Image
            src={`${src}`}
            width={width}
            height={height}
            alt={alt}
            className={`rounded-md h-full object-cover w-full ${isLoading ? "opacity-0" : "opacity-100"}`}
            onError={() => setError(true)}
            onLoad={() => setIsLoading(false)}
          />
        </>
      )}
    </div>
  );
};

export default ImageWithFallback;
