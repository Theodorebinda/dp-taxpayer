"use client";

import { ApplicationType } from "@/types/application.type";
import ApplicationCard from "./app-card";

type GridLayoutProps = {
  applications: ApplicationType[];
};

export default function GridLayout({ applications }: GridLayoutProps) {
  if (!applications.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} />
      ))}
    </div>
  );
}
