"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "zustand";
import { connectedUserStore } from "../store/connectedUser";
import { FaUserGraduate } from "react-icons/fa";
import Image from "next/image";

const USER_KEY = "dp-sk-moto-user";
const TOKEN_KEY = "dp-sk-moto-token";

const UserMenu = () => {
  const { user, setter } = useStore(connectedUserStore);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      const localUser = localStorage.getItem(USER_KEY);
      if (localUser && localUser !== "null") {
        setter(JSON.parse(localUser));
      }
    }
  }, [user, setter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const photoUrl = user?.agent?.photo;
  const showPhoto = photoUrl && photoUrl.length > 3;
  const profileName =
    user?.agent != null
      ? `${user.agent.firstName} ${user.agent.lastName}`
      : user?.name;

  const organizationName = user?.agent?.organization?.name;

  const handleLogout = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    router.push("/auth/login");
  };

  const handleChangePassword = () => {
    router.push("/change/auth/password");
  };

  return (
    <div className="flex gap-5 items-center sm:relative z-30">
      <div
        className="rounded-full bg-background text-foreground overflow-hidden flex items-center justify-center cursor-pointer border-4 border-primary"
        onClick={() => setMenuVisible((prev) => !prev)}
      >
        {showPhoto ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${
              photoUrl[0] === "/" ? "" : "/"
            }${photoUrl}`}
            alt="user's profile"
            width={50}
            height={50}
          />
        ) : (
          <FaUserGraduate size={30} className="m-2.5" />
        )}
      </div>

      {menuVisible && (
        <div
          ref={menuRef}
          className="absolute top-14 right-0 w-72 bg-background text-foreground border border-bg-secondary shadow-lg rounded-lg z-10"
        >
          <div className="flex flex-col p-5 border border-bg-secondary rounded-md m-5">
            <span className="text-lg font-bold">{profileName}</span>
            <span>role : {user?.role?.name || "---"}</span>
            {organizationName && (
              <span className="font-semibold">
                organisation : {organizationName}
              </span>
            )}
          </div>
          <ul className="py-2">
            <li
              className="px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer"
              onClick={handleLogout}
            >
              Déconnexion
            </li>
            <li
              className="px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer"
              onClick={handleChangePassword}
            >
              Changer le mot de passe
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
