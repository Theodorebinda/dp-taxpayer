import React from "react";
import DpLogo from "@/../public/logo/icon.png";
import Image from "next/image";

interface LoaderProps {
  size?: string;
}

const Loader: React.FC<LoaderProps> = () => {
  return (
    <div className=" w-full h-[calc(90vh)] min-h-40 flex items-center justify-center">
      <div className="flex  justify-center items-center gap-8 w-full h-full">
        <span className="pulse w-5 h-5"></span>
        <Image
          src={DpLogo}
          alt="Loading..."
          width={100}
          height={50}
          className="h-10 w-auto hidden md:block"
        />
      </div>
    </div>
  );
};

export default Loader;
