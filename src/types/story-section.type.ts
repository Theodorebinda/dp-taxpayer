export type StorySection = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;

  badges?: string[];
  steps?: { icon?: string; title: string; description?: string }[];
  stats?: { label: string; value: string | number }[];
  cta?: { label: string; href: string };
  highlight?: boolean;
  theme?: "light" | "dark" | "auto";
};
