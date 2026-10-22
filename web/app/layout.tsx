import type { Metadata } from "next";
import PwaRegistration from "./pwa-registration";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dar al-Kutub — The Digital Islamic Library",
  description: "A quiet place to explore a considered collection of Islamic books.",
  icons: {
    icon: "/twa-icon.svg",
    shortcut: "/twa-icon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <PwaRegistration />
      </body>
    </html>
  );
}
