import { ConnectedUser } from "@/types/connected-user";
import { create } from "zustand";

type ConnectedUserStoreType = {
  user: null | ConnectedUser;
  setter: (data: ConnectedUser | null) => void;
};

export const connectedUserStore = create<ConnectedUserStoreType>()((set) => ({
  user: null,
  setter: (user) => {
    return set({ user });
  },
}));
