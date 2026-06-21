import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import { siteUrl } from "@/lib/siteUrl";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Caffe Junior — Service & Reparation af Kaffemaskiner",
    template: "%s | Caffe Junior",
  },
  description:
    "Professionel service, reparation og vedligeholdelse af kaffemaskiner i Danmark. Book service online og få din maskine tilbage i topform.",
  openGraph: {
    type: "website",
    siteName: "Caffe Junior",
    title: "Caffe Junior — Service & Reparation af Kaffemaskiner",
    description:
      "Professionel service, reparation og vedligeholdelse af kaffemaskiner i Danmark. Book service online og få din maskine tilbage i topform.",
    images: [
      {
        url: "/images/header-image.png",
        width: 1200,
        height: 630,
        alt: "Caffe Junior — Kaffemaskine service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caffe Junior — Service & Reparation af Kaffemaskiner",
    description:
      "Professionel service, reparation og vedligeholdelse af kaffemaskiner i Danmark.",
    images: ["/images/header-image.png"],
  },
};

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