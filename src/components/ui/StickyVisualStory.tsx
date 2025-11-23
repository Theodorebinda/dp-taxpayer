"use client";

import { useActiveSection } from "@/hooks/useActiveSection";
import { SectionImageBlock } from "@/modules/formEngine/ui/SectionImageBlock";
import { SectionTextBlock } from "@/modules/formEngine/ui/TextBlock";
import { StorySection } from "@/types/story-section.type";
import Image from "next/image";

export default function StickyVisualStory({
  sections,
}: {
  sections: StorySection[];
}) {
  const { activeIndex, sectionRefs } = useActiveSection(sections.length);

  return (
    <div className="max-w-7xl layout-shell mx-auto px-6 md:px-10 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* LEFT – desktop scrolling text */}
      <div className="hidden lg:flex flex-col gap-40">
        {sections.map((s, i) => (
          <section
            key={s.id}
            ref={(el) => {
              sectionRefs.current[i] = el as HTMLDivElement | null;
            }}
            className="py-10"
          >
            <SectionTextBlock
              section={s}
              index={i}
              active={i === activeIndex}
              activeIndex={activeIndex}
            />
          </section>
        ))}
      </div>

      {/* RIGHT – sticky image */}
      <div className="hidden lg:block">
        <SectionImageBlock activeSection={sections[activeIndex]} />
      </div>

      {/* MOBILE */}
      <div className="lg:hidden space-y-8 col-span-1">
        {sections.map((section, index) => (
          <div key={section.id} className="space-y-6">
            <div className="text-sm font-semibold text-blue-600">
              {String(index + 1).padStart(2, "0")}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {section.title}
            </h3>
            <div className="aspect-4/3 relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src={section.image}
                alt={section.imageAlt || section.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
              />
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {section.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
