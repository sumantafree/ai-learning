import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Learning System — Become an AI Generalist",
  description:
    "Your personal AI Mentor. Generate daily learning tasks, track progress, and build AI projects.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1e1e2e",
              color: "#cdd6f4",
              border: "1px solid #45475a",
            },
          }}
        />
      </body>
    </html>
  );
}
