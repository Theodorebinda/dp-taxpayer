"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./commons/sidebar";
import TopBanner from "./commons/topBanner";

const PUBLIC_PATHS = [
  "/auth/login",
  "/public/taxpayer/registration",
  "/public/registration",
];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();

  const [isExcludedPath, setIsExcludedPath] = useState(
    path.startsWith("/public") || false
  );
  useEffect(() => {
    if (PUBLIC_PATHS.includes(path)) setIsExcludedPath(true);
    else if (path.startsWith("/public")) setIsExcludedPath(true);
    else setIsExcludedPath(false);
  }, [path]);

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    if (!isExcludedPath) {
      const storedUser = localStorage.getItem("dp-sk-moto-user");
      const connectedUser = storedUser ? JSON.parse(storedUser) : null;

      if (!connectedUser && !isExcludedPath && !path.startsWith("/public")) {
        router.push("/auth/login");
      }
    }
  }, [path, router]);

  return (
    <>
      {isExcludedPath == false && <Sidebar />}
      <div
        className={`w-full min-h-screen bg-bg-secondary ${
          path == "/" && "dark:bg-background"
        } overflow-y-auto`}
      >
        {isExcludedPath == false && <TopBanner />}
        {children}
      </div>
    </>
  );
}
