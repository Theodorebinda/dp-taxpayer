"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import appLogo from "@/../public/logo/icon.png";
import Image from "next/image";
import HttpClient from "@/utils/http-client";
import { sidebarState } from "../store/sidebarState";
import { useStore } from "zustand";
import Button from "./button";
import { applictionsStore } from "../store/applications";
import { currentMenuStore } from "../store/currentMenu";
import { ApplicationType } from "@/types/application.type";
import SVGComponent from "../atoms/displaySVG";
import NavSection from "../atoms/navBarSection";
import { LuX } from "react-icons/lu";

const SidebarLoader = () => {
  return (
    <div className="lg:w-[300px] w-screen animate-pulse z-10 flex flex-col p-5 gap-5">
      {Array(8)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="h-10 bg-bg-secondary rounded-md w-full mx-auto"
          ></div>
        ))}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const path = usePathname();
  const [error, setInnerError] = useState<
    | {
        code: number;
        message: string;
        [key: string]: any;
      }
    | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);
  const [fetchMenu, setFetchMenu] = useState(true);
  const { isOpen, setIsOpen } = useStore(sidebarState);
  const [sidebarWidth, setSidebarWidth] = useState<number | string>(400);
  const [isResizing, setIsResizing] = useState(false);

  const {
    setApplications,
    setIsLoading,
    setError,
    setCurrentApplication,
    applications,
    currentApplication,
  } = useStore(applictionsStore);
  const { menus, setMenus } = useStore(currentMenuStore);
  const routeParams: {
    application: string;
    app: string;
    model?: string;
    id?: string;
  } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (window) {
      const handleResize = () => {
        if (window?.innerWidth < 1024) {
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
      };

      handleResize();
      window?.addEventListener("resize", handleResize);

      return () => {
        window?.removeEventListener("resize", handleResize);
      };
    }
  }, [setIsOpen]);

  useEffect(() => {
    if (window && window?.innerWidth < 1024) {
      setSidebarWidth("100%");
    } else if (isOpen) setSidebarWidth(400);
    else setSidebarWidth(100);
  }, [isOpen]);

  useEffect(() => {
    const requester = async () => {
      try {
        setIsLoading(true);
        setLoading(true);
        const httpClient = new HttpClient();
        const data:
          | { code: number; message: string; data: ApplicationType[] }
          | false = await httpClient.get("load/app");
        if (!data) {
          if (
            httpClient.error?.code == 401 &&
            ["/public/taxpayer/registration"].includes(path)
          ) {
            router.push("auth/login");
          }
          setError(httpClient.error as any);
          setInnerError(httpClient.error as any);
          return;
        } else if (!data.data && httpClient.error !== null) {
          setError(httpClient.error);
          setInnerError(httpClient.error);
        } else {
          setError(undefined);
          setInnerError(undefined);
          setApplications(data.data);
        }

        let currentApp =
          data?.data.find((app) => app.name == routeParams?.application) ||
          null;
        if (path.split("/").length > 3) {
          currentApp =
            data?.data.find((app) => {
              const data = app.menus.filter(
                (menu) =>
                  menu.menuActions.filter((menuAction) => {
                    return (
                      menuAction.action.path.includes(path.split("/")[2]) &&
                      menuAction.action.path.includes(path.split("/")[3])
                    );
                  }).length > 0
              );
              return data.length > 0;
            }) || null;
        }

        setCurrentApplication(currentApp);
        setMenus(currentApp?.menus ? currentApp.menus : []);
      } catch (error: any) {
        if (menus.length > 0) {
          setError({
            code: error.code || 500,
            message: error.message || "une erreur s'est produite",
          });

          setInnerError({
            code: error.code || 500,
            message: error.message || "une erreur s'est produite",
          });
        }
      } finally {
        setLoading(false);
        setFetchMenu(false);
        setIsLoading(false);
      }
    };
    if (path == "/auth/login") setMenus([]);
    if (fetchMenu && path !== "/auth/login" && !path.startsWith("/public"))
      requester();
  }, [
    fetchMenu,
    path,
    menus.length,
    routeParams.application,
    routeParams?.app,
    routeParams?.model,
    router,
    setApplications,
    setMenus,
    setCurrentApplication,
    setError,
    setIsLoading,
  ]);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const newWidth = e.clientX;
    if (newWidth > 100 && newWidth < 500) {
      if (window && window?.innerWidth < 1024) {
        setSidebarWidth("100%");
      } else setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove]);

  if (["/auth/login"].includes(path)) {
    return <div></div>;
  }

  if (path == "/") return <span></span>;

  return (
    <>
      <div
        className={`max-lg:fixed z-40 bg-background max-lg:h-dvh h-screen overflow-hidden text-foreground shadow-md flex-col transition-all flex  ${
          isOpen ? "" : "max-lg:hidden"
        }`}
        style={{
          width:
            applications.length > 0 && menus.length > 0
              ? sidebarWidth
              : "fit-content",
        }}
      >
        <div className="flex items-center justify-between h-fit w-full max-lg:w-full">
          <div className="flex items-center justify-start gap-5 p-5 ">
            <span
              onClick={() => {
                router.push("/");
              }}
              className="p-3 cursor-pointer border border-bg-secondary rounded-lg w-16"
            >
              <Image
                src={appLogo}
                alt="digipublic logo"
                width={70}
                height={50}
                className="!w-full"
              />
            </span>
            {(typeof sidebarWidth == "string" || +sidebarWidth > 250) &&
              currentApplication !== null && (
                <span className="text-xl font-semibold">
                  {currentApplication.verbose[0].toUpperCase() +
                    currentApplication.verbose.slice(1)}
                </span>
              )}
          </div>
          <span
            className="cursor-pointer lg:hidden max-lg:px-5"
            onClick={() => setIsOpen(false)}
          >
            <LuX size={30} />
          </span>
        </div>

        <div
          className={`flex h-full w-full overflow-y-auto overflow-x-hidden border-t border-bg-secondary justify-center ${
            +sidebarWidth > 500 || +sidebarWidth < 150 ? "w-full" : "w-fit"
          }`}
        >
          {applications && applications.length > 0 && (
            <div
              className={`flex flex-col p-5 gap-5 border-r border-bg-secondary items-center h-full justify-start ${
                (applications.length > 0 && menus.length == 0) ||
                +sidebarWidth <= 160
                  ? "w-full"
                  : false
              }`}
            >
              {applications.map((app) => {
                const isAppActive = app.isActive && app.menus.length > 0;
                return (
                  <button
                    key={app.id}
                    className={`p-3 rounded-md ${
                      !isAppActive
                        ? "text-gray-400"
                        : currentApplication?.id == app.id
                        ? "bg-[#04899630] text-primary"
                        : "hover:bg-bg-secondary text-foreground"
                    }`}
                    onClick={() => {
                      if (!app.isActive || app.menus.length === 0) return;
                      setCurrentApplication(app);
                      setMenus(app.menus);
                      if (window && window?.innerWidth < 1024) {
                        setSidebarWidth("100%");
                      } else setSidebarWidth(400);
                    }}
                  >
                    {/* <span className="block w-1 h-1 bg-green-500"></span> */}
                    <SVGComponent icon={app.icon} height="20" width="20" />
                  </button>
                );
              })}
            </div>
          )}

          {loading ? (
            <SidebarLoader />
          ) : error ? (
            <div className="p-5 flex flex-col gap-5 items-center lg:w-[300px] w-screen ">
              <span>
                Nous n&apos;avons pas pu charger les menus. Veuillez ressayer
              </span>
              <code className="bg-bg-secondary p-5 rounded-lg w-full text-wrap">
                {error.message}
              </code>
              <Button
                variant="outline"
                onClick={() => {
                  setLoading(true);
                  setFetchMenu(true);
                }}
                isLoading={loading}
                className="p-3 !rounded-full"
              >
                refresh
              </Button>
            </div>
          ) : currentApplication?.menus.length == 0 ? (
            false
          ) : (
            (+sidebarWidth > 160 || typeof sidebarWidth == "string") && (
              <div className="flex flex-col gap-5 py-5 w-full h-full z-30 max-lg:bg-bg-secondary">
                <nav className="flex flex-col overflow-x-hidden overflow-y-auto w-full max-lg:gap-2">
                  {currentApplication?.menus.map((menu) => (
                    <NavSection {...menu} key={menu.name} />
                  ))}
                </nav>
              </div>
            )
          )}
        </div>
      </div>

      {(loading || !error) && (
        <div
          className="w-fit max-lg:hidden border-l border-bg-secondary px-1 flex items-center cursor-ew-resize text-foreground"
          onMouseDown={handleMouseDown}
        >
          {/* <GoGrabber size={20} /> */}
          <span className="bloc w-2 h-10 rounded-xl bg-app-blue-800 opacity-50"></span>
        </div>
      )}
    </>
  );
};

export default Sidebar;
