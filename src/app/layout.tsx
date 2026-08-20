import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderBar from "@/components/HeaderBar";
import { AuthProvider } from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Događaji u Beogradu",
  description:
    "Pozorište, koncerti, književni događaji i kulturna dešavanja u Beogradu",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sr">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          min-h-screen
          bg-[#F0F9FF]
          text-[#0F2942]
          antialiased
        `}
      >
        <AuthProvider>
          <HeaderBar />

          <main className="min-h-[calc(100vh-80px)]">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
