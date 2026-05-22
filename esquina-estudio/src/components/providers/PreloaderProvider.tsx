"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

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
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);
  const markPreloaderDone = useCallback(() => {
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
