"use client";

import Image from "next/image";

type StepSidebarProps = {
  title: string;
  description: string;
  illustration: string;
  stepIndex: number;
  stepsCount: number;
};

export default function StepSidebar({
  title,
  description,
  illustration,
  stepIndex,
  stepsCount,
}: StepSidebarProps) {
  return (
    <aside className="hidden md:flex flex-col justify-between h-full bg-gradient-to-br from-blue-500 to-indigo-200 text-white p-10">
      <div>
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/15 backdrop-blur-sm">
            <span className="text-xl font-bold">{stepIndex + 1}</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-white/80 text-base">{description}</p>
      </div>
      <div className="flex items-end justify-center">
        {/* Use a plain img to avoid next/image constraints */}
        <Image
          width={100}
          height={100}
          src={illustration}
          alt="Illustration d'étape"
          className="max-w-full h-64 object-contain opacity-95"
        />
      </div>
      <div className="text-white/70 text-sm mt-6">
        Étape {stepIndex + 1} sur {stepsCount}
      </div>
    </aside>
  );
}
