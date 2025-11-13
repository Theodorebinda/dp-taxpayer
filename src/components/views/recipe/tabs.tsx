"use client";
import {
  Calculator,
  Edit,
  Eye,
  FormInputIcon,
  Pen,
  StepForwardIcon,
  EllipsisVertical,
} from "lucide-react";
import { IconType } from "react-icons";
import { usePathname, useParams, useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";

const tabs: {
  label: string;
  path: string;
  displayIf?: () => void;
  icon: IconType;
}[] = [
  { label: "Vue global", path: "/view/core/recipe/{{RECIPE_ID}}", icon: Eye },
  {
    label: "Ajouter un enfant",
    path: "add_child",
    icon: Edit,
  },
  {
    label: "Formule de calcul",
    path: "formula",
    icon: Calculator,
  },
  {
    label: "Formulaire d'identification",
    path: "id-form",
    icon: FormInputIcon,
  },
  {
    label: "Étapes de taxations",
    path: "steps",
    icon: StepForwardIcon,
  },
];

const ViewRecipeTabs = ({ recipeId }: { recipeId: string }) => {
  const pathname = usePathname();
  const params: { app: string; model: string; id: string } = useParams();
  const router = useRouter();

  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [visibleTabs, setVisibleTabs] = useState(tabs);
  const [hiddenTabs, setHiddenTabs] = useState<typeof tabs>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Calcul des tabs visibles vs cachés
  useEffect(() => {
    const updateVisibleTabs = () => {
      const container = tabsContainerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const tabElements = container.children;
      let totalWidth = 0;
      const newVisibleTabs: typeof tabs = [];
      const newHiddenTabs: typeof tabs = [];

      // Réserve de l'espace pour le bouton dropdown (environ 40px + marge)
      const availableWidth = containerWidth - 50;

      for (let i = 0; i < tabs.length; i++) {
        const tabElement = tabElements[i] as HTMLElement;
        const tabWidth = (tabElement?.offsetWidth || 0) + 10; // + marge

        if (totalWidth + tabWidth <= availableWidth) {
          newVisibleTabs.push(tabs[i]);
          totalWidth += tabWidth;
        } else {
          newHiddenTabs.push(tabs[i]);
        }
      }

      setVisibleTabs(newVisibleTabs);
      setHiddenTabs(newHiddenTabs);
    };

    updateVisibleTabs();
    window.addEventListener("resize", updateVisibleTabs);

    return () => {
      window.removeEventListener("resize", updateVisibleTabs);
    };
  }, [tabs]);

  const handleTabClick = (path: string) => {
    const fullPath = path.startsWith("/")
      ? path.replace("{{RECIPE_ID}}", recipeId)
      : `/view/core/recipe/${params.id}/${path}`;

    router.push(fullPath);
  };

  return (
    <div className="flex items-center gap-2.5 w-full relative">
      {/* Container pour les tabs visibles */}
      <div
        ref={tabsContainerRef}
        className="flex items-center gap-2.5 flex-1 overflow-hidden"
      >
        {visibleTabs.map((tab) => {
          const path = tab.path.startsWith("/")
            ? tab.path.replace("{{RECIPE_ID}}", recipeId)
            : `/view/core/recipe/${params.id}/${tab.path}`;

          const isActive = pathname === path;

          return (
            <button
              key={tab.label}
              onClick={() => handleTabClick(tab.path)}
              disabled={isActive}
              className="justify-center font-medium transition duration-200 ease-in-out flex items-center gap-2 bg-gray-500 text-background shadow hover:bg-primary/70 py-2 px-5 rounded-md text-nowrap disabled:bg-primary flex-shrink-0"
              title={tab.label}
            >
              <tab.icon size={15} />
              <span className="max-md:hidden">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bouton dropdown pour les tabs cachés */}
      {hiddenTabs.length > 0 && (
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="justify-center font-medium transition duration-200 ease-in-out flex items-center gap-2 bg-gray-500 text-background shadow hover:bg-primary/70 py-2 px-5 rounded-md text-nowrap disabled:bg-primary flex-shrink-0"
          >
            <EllipsisVertical size={20} />
          </button>

          {/* Menu dropdown */}
          {showDropdown && (
            <>
              {/* Overlay pour fermer le dropdown en cliquant ailleurs */}
              <button
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />

              <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-[150px]">
                {hiddenTabs.map((tab) => {
                  const path = tab.path.startsWith("/")
                    ? tab.path.replace("{{RECIPE_ID}}", recipeId)
                    : `/view/core/recipe/${params.id}/${tab.path}`;

                  const isActive = pathname === path;

                  return (
                    <button
                      key={tab.label}
                      onClick={() => {
                        handleTabClick(tab.path);
                        setShowDropdown(false);
                      }}
                      className={`font-medium transition duration-200 ease-in-out flex items-center justify-start gap-2 text-background hover:bg-primary/70 py-2 px-5 rounded-md text-nowrap disabled:bg-primary flex-shrink-0 w-full  ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <tab.icon size={15} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewRecipeTabs;
