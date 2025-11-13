import { ApplicationType } from "@/types/application.type";
import SVGComponent from "../atoms/displaySVG";
import { useRouter } from "next/navigation";

const ApplicationCard = (
  props: ApplicationType & {
    setCurrentApplication: (data: ApplicationType | null) => void;
    loadingAppId: string | null;
    setLoadingAppId: (uuid: string | null) => void;
    isAppActive: boolean;
    setMenus: (menus: any[]) => void;
  }
) => {
  const router = useRouter();
  return (
    <div
      onClick={() => {
        if (!props.isAppActive) return;
        props.setLoadingAppId(props.id);
        props.setCurrentApplication(props);
        props.setMenus(props.menus);
        setTimeout(() => {
          props.setLoadingAppId(null);
        }, 5000);
        router.push(props.menus[0]?.menuActions[0]?.action.path || props.name);
      }}
      className={`group p-5 w-72 h-72 max-md:w-full rounded-lg cursor-pointer flex flex-col justify-start items-start gap-3 shadow-sm dark:shadow-none duration-300 relative overflow-hidden dark:border-none  transition-all ${
        !props.isAppActive
          ? "bg-gray-300 dark:bg-gray-700 text-foreground"
          : "bg-background dark:bg-app-blue-600 hover:bg-app-green-500 hover:font-bold hover:text-background"
      }`}
    >
      <div
        className={`w-full !h-36 p-2 rounded-md z-10 flex items-center justify-center ${
          props.isAppActive
            ? "text-app-green bg-app-green-50 dark:bg-app-blue-50 dark:text-app-blue-500 dark:opacity-80 dark:group-hover:text-app-green-500"
            : "text-gray-700  dark:bg-gray-500 bg-gray-200"
        }`}
      >
        <SVGComponent width="40" height="40" icon={props.icon} />
      </div>

      <div className="z-10 flex flex-col justify-end items-start gap-5 w-full text-center">
        <strong className="hover:text-bold text-app-green group-hover:text-background z-10 w-full text-center">
          {props.verbose?.toUpperCase() || props.name?.toUpperCase()}
        </strong>
        <span className="z-10 w-full text-center">
          {props?.description &&
            `${props.description[0].toUpperCase()}${props.description.slice(
              1
            )}`}
        </span>
      </div>

      {props.loadingAppId == props.id && (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/50 bg-opacity-50 rounded-lg z-20">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;
