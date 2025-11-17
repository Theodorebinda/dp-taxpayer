"use client";

import { LuLayoutPanelLeft } from "react-icons/lu";
import { ApplicationType } from "@/types/application.type";
import { capitalizeWords } from "@/utils/utils";
import SVGComponent from "../atoms/displaySVG";
import MenuCard from "./menu-card";
import { useNavigationStore } from "@/store/navigation-store";

type ListLayoutProps = {
  applications: ApplicationType[];
};

export default function ListLayout({ applications }: ListLayoutProps) {
  const currentApplicationId = useNavigationStore(
    (state) => state.currentApplicationId
  );

  if (!applications.length) {
    return null;
  }

  return (
    <div className="space-y-8">
      {applications.map((application) => {
        const isSelected = currentApplicationId === application.id;
        return (
          <section
            key={application.id}
            className="relative w-full flex flex-col gap-5"
          >
            <header className="flex items-center gap-3">
              <span
                className={`p-2.5 rounded-full inline-flex ${
                  isSelected
                    ? "bg-primary text-background"
                    : "bg-muted text-foreground"
                }`}
              >
                {application.icon?.length ? (
                  <SVGComponent icon={application.icon} />
                ) : (
                  <LuLayoutPanelLeft />
                )}
              </span>
              <div>
                <p className="font-semibold text-lg">
                  {capitalizeWords(application.verbose || application.name)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {application.description}
                </p>
              </div>
            </header>
            <div className="lg:pl-5 grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {(application.menus ?? []).map((menu) => (
                <MenuCard
                  key={menu.id}
                  menu={menu}
                  applicationId={application.id}
                  applicationName={
                    application.verbose || application.name || "Application"
                  }
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
