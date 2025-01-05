import { NextUIProvider } from "@nextui-org/react";
import { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  );
}