"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/useToast";
import { useQueryClient } from "@tanstack/react-query";

export default function TokenWatcher() {
  const { data: session, status } = useSession();
  const { info } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (status === "authenticated") return;

    if (status === "unauthenticated") {
      info("Votre session a expiré.");
      queryClient.clear(); // reset client-side cache
    }
  }, [status, session, info, queryClient]);

  return null;
}
