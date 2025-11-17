"use client";

import { useMemo } from "react";
import { ApplicationType } from "@/types/application.type";
import { useApplications } from "./use-applications";

export function usePrimaryApplication() {
  const query = useApplications();
  const application = useMemo<ApplicationType | null>(() => {
    if (!query.data || query.data.length === 0) return null;
    return query.data[0];
  }, [query.data]);

  return {
    ...query,
    data: application,
  };
}
