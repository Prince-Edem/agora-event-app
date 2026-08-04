import { AccountView } from "@neondatabase/auth/react";
import { accountViewPaths } from "@neondatabase/auth/react/ui/server";

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((path) => ({ path }));
}


export default async function AccountPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {

  const {path} = await params;
  return (
    <main className="container px-4 md:px-6  py-16 md:py-16">
      <AccountView path={path}/>
    </main>
  )
}