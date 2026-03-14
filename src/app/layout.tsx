import type { ReactNode } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="da">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

// TODO: Update the html lang attribute dynamically if you later want full accessibility alignment with the selected language.
// TODO: Add global providers here if theme or auth context is introduced later.