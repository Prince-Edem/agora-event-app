"use client";

import Link from "next/link";
import { UserButton } from '@neondatabase/auth-ui';
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";


export default function NavBar() {
  const pathname = usePathname();

  if (pathname === "/") {
    return (
    <nav className="fixed top-0 w-full z-50">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur">
        <div className="mx-auto flex items-center justify-between h-16 w-full max-w-6xl px-4">
          <Link href={"/"} className="text-3xl font-bold tracking-tighter">
            GATHR.
          </Link>
          <Button className="px-5 py-4">
            <Link href={"/auth/sign-in"}>Sign in</Link>
          </Button>
        </div>
      </header>
    </nav>
  )}

  if (pathname === "/auth/sign-in" || pathname === "/auth/sign-up") {
    return (
    <nav className="fixed top-0 w-full z-50">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur">
        <div className="mx-auto flex items-center justify-between h-16 w-full max-w-6xl px-4">
          <Link href={"/"} className="text-3xl font-bold tracking-tighter">
            GATHR.
          </Link>
          <div></div>
        </div>
      </header>
    </nav>
  )}

  return (
    <nav className="fixed top-0 w-full z-50">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur">
        <div className="mx-auto flex items-center justify-between h-16 w-full max-w-6xl px-4">
          <Link href={"/"} className="text-3xl font-bold tracking-tighter">
            GATHR.
          </Link>
          <nav className="text-md text-[var(--muted-foreground)]">
            <Link href={"/dashboard"}>Dashboard</Link>
            <span className="mx-2" aria-hidden="true"></span>
            <UserButton size="icon"/>
          </nav>
        </div>
      </header>
    </nav>
  )
}