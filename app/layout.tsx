import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";

export const metadata: Metadata = {
  title: "ZeroAI - AI Math Tutor",
  description: "An AI-powered math tutor using Socratic dialogue",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="antialiased h-full overflow-hidden">
        {children}
      </body>
    </html>
  );
}
