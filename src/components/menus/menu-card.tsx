"use client";

import { useRouter } from "next/navigation";
import { LuCircle, LuFolderOpen, LuLink } from "react-icons/lu";
import SVGComponent from "../atoms/displaySVG";
import { capitalizeWords } from "@/utils/utils";
import { SideMenuType } from "@/types/application.type";
import { useMarkMenuVisited } from "@/hooks/use-mark-menu-visited";

type MenuCardProps = {
  menu: SideMenuType;
  applicationId: string;
  applicationName: string;
};

export default function MenuCard({
  menu,
  applicationId,
  applicationName,
}: MenuCardProps) {
  const router = useRouter();
  const {
    mutate,
    isPending: isMutatingGlobal,
    variables,
  } = useMarkMenuVisited();

  const actionCount = menu.menuActions?.length ?? 0;
  const hasActions = actionCount > 0;
  const isVisited = Boolean(menu.visited);
  const isMutating = isMutatingGlobal && variables?.menuId === menu.id;

  const handleNavigate = () => {
    if (!hasActions) return;
    const targetPath = menu.menuActions[0]?.action?.path;
    if (!targetPath) return;
    router.push(targetPath);
    mutate({ applicationId, menuId: menu.id });
  };

  return (
    <button
      disabled={!hasActions || isMutating}
      onClick={handleNavigate}
      className={`relative flex items-center gap-4 rounded-lg border p-4 text-left transition ${
        hasActions
          ? "hover:border-primary hover:bg-primary/5"
          : "opacity-50 cursor-not-allowed"
      }`}
    >
      {isMutating && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/70 backdrop-blur-sm">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      <span
        className={`hidden rounded-md p-2 md:inline-flex ${
          hasActions ? "text-primary bg-primary/10" : "text-muted-foreground"
        }`}
      >
        {menu.icon?.length ? (
          <SVGComponent width="20" height="20" icon={menu.icon} />
        ) : (
          <LuFolderOpen size={20} />
        )}
      </span>

      <div className="flex-1 space-y-1">
        <p
          className={`font-semibold ${
            !hasActions ? "text-muted-foreground" : ""
          }`}
        >
          {capitalizeWords(menu.name)}
        </p>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <LuLink />
          <span>
            {actionCount} action{actionCount > 1 ? "s" : ""} · {applicationName}
          </span>
        </p>
      </div>

      <span className="flex items-center gap-2 text-sm">
        <LuCircle
          className={isVisited ? "text-green-500" : "text-yellow-500"}
        />
        <span className="hidden text-muted-foreground lg:inline">
          {isVisited ? "Visité" : "Nouveau"}
        </span>
      </span>
    </button>
  );
}
