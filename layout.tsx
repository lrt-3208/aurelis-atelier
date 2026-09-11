import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aurelis Atelier — The quiet architecture of becoming",
  description: "Aurelis Atelier creates couture bridal objects for the threshold between who you were and who you are becoming.",
  other: {
    "codex-preview": "development",
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
