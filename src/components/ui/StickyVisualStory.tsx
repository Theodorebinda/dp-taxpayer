"use client";

import { useActiveSection } from "@/hooks/useActiveSection";
import { SectionImageBlock } from "@/modules/formEngine/ui/SectionImageBlock";
import { SectionTextBlock } from "@/modules/formEngine/ui/TextBlock";
import { StorySection } from "@/types/story-section.type";
import Image from "next/image";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui/Badge-ui";
import { Check } from "lucide-react";
import { FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";

const iconMap: Record<string, React.ReactNode> = {
  check: <Check className="w-5 h-5" />,
};

export default function StickyVisualStory({
  sections,
}: {
  sections: StorySection[];
}) {
  const { activeIndex, sectionRefs } = useActiveSection(sections.length);
  const router = useRouter();

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
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-app-blue-900 dark:text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              {section.highlight && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold bg-primary/10 text-primary border-primary/20">
                  ★ Recommandé
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-primary dark:text-text">
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
            <p className="text-lg opacity-90 text-app-blue-900 dark:text-text">
              {section.description}
            </p>
            {section.steps && section.steps.length > 0 && (
              <div className="flex flex-col gap-2 mt-4">
                {section.steps.map((s) => (
                  <div key={s.title} className="flex items-start gap-3">
                    {s.icon && (
                      <div className="shrink-0 mt-1 text-primary">
                        {iconMap[s.icon]}
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg font-semibold text-app-blue-900 dark:text-text">
                        {s.title}
                      </h4>
                      {s.description && (
                        <p className="text-sm opacity-90">{s.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {section.badges && section.badges.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-4">
                {section.badges.map((b, badgeIndex) => (
                  <Badge key={badgeIndex} label={b} icon={<FaCheck />} />
                ))}
              </div>
            )}
            {section.stats && section.stats.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-4">
                {section.stats.map((s, statIndex) => (
                  <Badge key={statIndex} label={s.label} icon={<FaCheck />} />
                ))}
              </div>
            )}
            {section.cta && (
              <div className="mt-6 flex justify-start">
                <Button
                  variant="primary"
                  className="w-full py-3"
                  onClick={() => router.push(section.cta!.href)}
                >
                  {section.cta.label}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
