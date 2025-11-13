"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/cache/query-client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import ToastProvider from "@/components/ui/ToastProvider";
import { LoaderProvider } from "@/components/ui/LoaderGlobal";

export default function Providers({ children }: { children: React.ReactNode }) {
  const client = getQueryClient();
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={client}>
          <LoaderProvider>
            {children}
            <ToastProvider />
          </LoaderProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
