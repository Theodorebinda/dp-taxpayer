"use client";
import { useStore } from "zustand";
import { sidebarState } from "../store/sidebarState";
import { IoMenu } from "react-icons/io5";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ThemeToggleButton from "../atoms/themeToggleButton";
import UserMenu from "../atoms/userMenu";
import DP from "@/../public/logo/logo-inline.png";
import { connectedUserStore } from "../store/connectedUser";
import SVGComponent from "../atoms/displaySVG";
import { greeting } from "@/utils/utils";

const EXCLUDED_PATHS = ["/"];
const LOGIN_PATH = "/auth/login";

const TopBanner = () => {
  const { isOpen, setIsOpen } = useStore(sidebarState);

  const path = usePathname();

  const isExcludedPath = EXCLUDED_PATHS.includes(path);
  const isLoginPath = path === LOGIN_PATH;

  const { user } = useStore(connectedUserStore);
  const profileName =
    user?.agent != null
      ? `${user.agent.firstName} ${user.agent.lastName}`
      : user?.name;

  if (isLoginPath) return null;

  return (
    <div
      className={`flex justify-center w-full ${
        path == "/" ? "bg-[#263146]" : ""
      }`}
    >
      <div className={`flex justify-between items-center w-full py-5 px-10 max-md:px-5 gap-10 z-10 ${
        path == "/" ? "h-44 max-w-7xl" : ""
      }`}>
        <div className="flex items-center gap-5">
          {!isExcludedPath && (
            <span className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
              <IoMenu size={30} />
            </span>
          )}
          <ThemeToggleButton />
          {!isExcludedPath && (
            <Link className="flex items-center text-primary" href="/">
              <span>Accueil</span>
            </Link>
          )}
        </div>

        {path === "/" && (
          <div className="text-white flex flex-col items-center gap-5">
            <div className="flex items-center text-white gap-5 max-h-10">
              <Image
                src={DP}
                alt="Digipublic Logo"
                width={300}
                height={80}
                className="h-10 w-auto max-md:h-5 filter brightness-0 invert"
              />
              <span className="block bg-[#263146] rounded-full h-10 w-1 max-md:hidden"></span>
              {user?.agent?.organization?.photo ? (
                <Image
                  alt="organization photo"
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${
                    user?.agent?.organization?.photo[1] === "/" ? "" : "/"
                  }${user?.agent?.organization?.photo}`}
                  width={44}
                  height={44}
                  className="w-auto h-full rounded-full border max-md:w-8"
                />
              ) : (
                <SVGComponent
                  icon={`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-ban"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m4.243 5.21 14.39 12.472"/></svg>`}
                  width={"40px"}
                  height={"40px"}
                />
              )}
            </div>
            <span className="text-center">
              {`${greeting()}`} <b>{`${profileName} !`}</b>
            </span>
          </div>
        )}

        <UserMenu />
      </div>
    </div>
  );
};

export default TopBanner;
