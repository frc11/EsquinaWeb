"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const SESSION_KEY = "esquina:preloaderShown";

type PreloaderContextValue = {
  isPreloaderDone: boolean;
  markPreloaderDone: () => void;
};

const PreloaderContext = createContext<PreloaderContextValue | null>(null);

export function usePreloader() {
  const context = useContext(PreloaderContext);

  if (!context) {
    throw new Error("usePreloader must be used inside PreloaderProvider.");
  }

  return context;
}

export default function PreloaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // SSR-safe init: always false on server to avoid hydration mismatch.
  // On the client, useEffect resolves the real sessionStorage value.
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);

  useEffect(() => {
    // Sync from sessionStorage (external store) on mount.
    if (window.sessionStorage.getItem(SESSION_KEY) === "1") {
      // Intentional: syncing external store state into React on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPreloaderDone(true);
    }
  }, []);

  const markPreloaderDone = useCallback(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    }
    setIsPreloaderDone(true);
  }, []);

  const value = useMemo(
    () => ({ isPreloaderDone, markPreloaderDone }),
    [isPreloaderDone, markPreloaderDone],
  );

  return (
    <PreloaderContext.Provider value={value}>
      {children}
    </PreloaderContext.Provider>
  );
}
