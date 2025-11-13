"use client";
import { LuLayoutPanelLeft } from "react-icons/lu";
import { capitalizeWords } from "@/utils/utils";
import MenuCard from "./menu-card";
import { ApplicationType } from "@/types/application.type";
import SVGComponent from "../atoms/displaySVG";

const ModuleCard = (application: ApplicationType) => {
  return (
    <div className="relative w-full h-fit flex flex-col gap-5" key={application.id}>
      <h1 className="font-semibold flex items-center gap-2">
        <span className="bg-primary z-10 p-2.5 rounded-full inline-flex text-background">
          {application.icon?.length > 0 ? (
            <SVGComponent icon={application.icon} />
          ) : (
            <LuLayoutPanelLeft />
          )}
        </span>
        {capitalizeWords(application.verbose)}
      </h1>
      <div className="lg:pl-5 grid max-lg:grid-cols-2 max-xs:grid-cols-1 grid-cols-3 gap-5 ">
        {application.menus.map((menu) => (
          <MenuCard
            {...{ menu, currentApplication: application }}
            key={menu.id}
          />
        ))}
      </div>
    </div>
  );
};

export default ModuleCard;
