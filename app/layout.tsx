import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { NeonAuthUIProvider, UserButton } from '@neondatabase/auth-ui';
import { authClient } from "@/lib/auth/client";
import NavBar from "@/components/NavBar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agora",
  description: "Event management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <NeonAuthUIProvider authClient={authClient} redirectTo="/">
          <NavBar />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8">
            {children}
          </main>
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
