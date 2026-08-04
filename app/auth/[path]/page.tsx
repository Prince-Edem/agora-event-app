import { AuthView } from '@neondatabase/auth-ui';
import { authViewPaths } from '@neondatabase/auth-ui/server';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  const redirectTo = path === "sign-out" ? "/" : undefined;

  return (
    <main className="flex flex-1 items-center justify-center py-16 md:py-18">
      <AuthView path={path} redirectTo={redirectTo} />
    </main>
  );
}