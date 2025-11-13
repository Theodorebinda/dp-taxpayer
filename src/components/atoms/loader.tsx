import React from "react";
// import DpLogo from "@/../public/logo/icon.png";
// import Image from "next/image";

interface LoaderProps {
  size?: string;
}

const Loader: React.FC<LoaderProps> = () => {
  return (
    <div className=" w-full h-full min-h-40 flex items-center justify-center">
      <div className="flex flex-col justify-center items-center gap-5 w-full h-full">
        <span className="pulse w-8 h-8"></span>
        {/* <Image src={DpLogo} alt="Loading..." width={150} height={50} /> */}
      </div>
    </div>
  );
};

export default Loader;
