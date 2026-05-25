"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import PreloaderProvider from "@/components/providers/PreloaderProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import LoadingScreen from "@/components/ui/LoadingScreen";

export default function RootClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudio = pathname === "/studio" || pathname.startsWith("/studio/");

  useEffect(() => {
    if (isStudio) {
      delete document.body.dataset.customCursor;
      return;
    }
  }, [isStudio]);

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <PreloaderProvider>
      <CustomCursor />
      <LoadingScreen />
      {children}
    </PreloaderProvider>
  );
}
