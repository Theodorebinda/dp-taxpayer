"use client";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

type LoaderContextValue = {
  loading: boolean;
  show: () => void;
  hide: () => void;
};

const LoaderContext = createContext<LoaderContextValue | null>(null);

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const value = useMemo(
    () => ({
      loading,
      show: () => setLoading(true),
      hide: () => setLoading(false),
    }),
    [loading]
  );
  return (
    <LoaderContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="global-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              backdropFilter: "blur(2px)",
              background: "rgba(0,0,0,0.1)",
              display: "grid",
              placeItems: "center",
              zIndex: 60,
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              style={{
                padding: 16,
                borderRadius: 12,
                background: "var(--background)",
                color: "var(--color-text)",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <div
                className="pulse"
                style={{ width: 14, height: 14, margin: "0 auto 8px" }}
              />
              <div style={{ textAlign: "center", fontSize: 14 }}>
                Chargement…
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const ctx = useContext(LoaderContext);
  if (!ctx)
    throw new Error("useLoader doit être utilisé dans <LoaderProvider>");
  return ctx;
}
