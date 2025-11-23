"use client";

import { Button } from "@/components/ui";
import { Badge } from "@/components/ui/Badge-ui";
import { StorySection } from "@/types/story-section.type";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";

const iconMap: Record<string, React.ReactNode> = {
  check: <Check className="w-5 h-5" />,
};

export function SectionTextBlock({
  section,
  index,
  active,
  activeIndex,
}: {
  section: StorySection;
  index: number;
  active: boolean;
  activeIndex: number;
}) {
  const router = useRouter();

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: active ? 1 : index < activeIndex ? 0.7 : 0.4,
        y: active ? 0 : index < activeIndex ? -10 : 10,
      }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-semibold text-app-blue-900 dark:text-primary">
          {String(index + 1).padStart(2, "0")}
        </span>

        {section.highlight && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold bg-primary/10 text-primary border-primary/20">
            ★ Recommandé
          </span>
        )}
      </div>

      <h3 className="text-3xl font-bold mb-4 text-primary dark:text-text">
        {section.title}
      </h3>
      <p className="text-lg opacity-90 text-app-blue-900 dark:text-text">
        {section.description}
      </p>
      <div className="flex flex-col gap-2 mt-4">
        {section.steps?.map((s) => (
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

      {section.badges && (
        <div className="flex gap-2 flex-wrap mt-4">
          {section.badges.map((b, index) => (
            <Badge key={index} label={b} icon={<FaCheck />} />
          ))}
        </div>
      )}

      {section.stats && (
        <div className="flex gap-2 flex-wrap mt-4">
          {section.stats.map((s, index) => (
            <Badge key={index} label={s.label} icon={<FaCheck />} />
          ))}
        </div>
      )}

      {section.cta && (
        <div className="mt-20 flex justify-start w-1/3">
          <Button
            variant="primary"
            className="w-full py-3"
            onClick={() => router.push(section.cta!.href)}
          >
            {section.cta.label}
          </Button>
        </div>
      )}
    </motion.div>
  );
}
