import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dar al-Kutub — The Digital Islamic Library",
  description: "A quiet place to explore a considered collection of Islamic books.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
