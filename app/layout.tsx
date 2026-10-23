import type { Metadata } from "next";
import type { Viewport } from "next";
import PwaRegistration from "./pwa-registration";
import "./globals.css";

export const metadata: Metadata = {
  title: "Darul Kutub — The Digital Islamic Library",
  description: "A quiet place to explore a considered collection of Islamic books.",
  icons: {
    icon: "/icons/icon-192.png",
    shortcut: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    title: "Darul Kutub",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf8f1",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
