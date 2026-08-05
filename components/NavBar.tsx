"use client";

import Link from "next/link";
import { UserButton } from '@neondatabase/auth-ui';
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth/client";


export default function NavBar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const isAuthenticated = Boolean(session?.user?.id);
  const isAuthPage =
    pathname === "/auth/sign-in" ||
    pathname === "/auth/sign-up" ||
    pathname === "/auth/forgot-password";

  if (isAuthPage) {
    return (
    <nav className="fixed top-0 w-full z-50">
      <header className="border-b border-gray-500 bg-brand backdrop-blur">
        <div className="mx-auto flex items-center justify-between h-16 w-full max-w-6xl px-4">
          <Link href={"/"} className="text-3xl font-bold tracking-tighter text-white">
            GATHR<span className="text-gold">.</span>
          </Link>
          <div />
        </div>
      </header>
    </nav>
  )}

  return (
    <nav className="fixed top-0 w-full z-50">
      <header className="border-b border-gray-500 bg-brand backdrop-blur">
        <div className="mx-auto flex items-center justify-between h-16 w-full max-w-6xl px-4">
          <Link href={"/"} className="text-3xl font-bold tracking-tighter text-white">
            GATHR<span className="text-gold">.</span>
          </Link>

          {isAuthenticated ? (
            <div className="text-md text-[var(--muted-foreground)] flex items-center gap-2">
              <Link href={"/dashboard"}>Dashboard</Link>
              <UserButton size="icon" />
            </div>
          ) : (
            <Button className="text-md px-6 py-5 border-0 bg-white text-black hover:bg-white/95">
              <Link href={"/auth/sign-in"}>Sign in</Link>
            </Button>
          )}
        </div>
      </header>
    </nav>
  )
}