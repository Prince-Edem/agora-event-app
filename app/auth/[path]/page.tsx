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
  const isSignIn = path === "sign-in";
  const isSignUp = path === "sign-up";
  const isForgotPassword = path === "forgot-password";
  const isSigningOut = path === "sign-out";
  const redirectTo = isSigningOut ? "/" : (isSignIn || isSignUp) ? "/dashboard" : undefined;

  if (isSigningOut) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-background pt-16 px-4">
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="h-12 w-12 rounded-full border-4 border-slate-200 dark:border-slate-700"
            style={{ animation: "spin 1s linear infinite", borderTopColor: "var(--gold)" }}
          />
        </div>
        <div className="sr-only">
          <AuthView path={path} redirectTo={redirectTo} />
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center py-16 md:pt-14.5">
      <div className="w-full max-w-md">
        <div className="space-y-0.5 max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight">
            {isSignIn ? (
              <>
                Welcome back to <span className="text-[#4B3F8F]">AGORA</span>
              </>
            ) : isSignUp ? (
              "Create your account"
            ) : isForgotPassword ? (
              "Reset your password"
            ) : (
              "Manage your account"
            )}
          </h1>
          <p className={"text-sm leading-6 text-gray-500"}>
            {isSignIn
              ? "Sign in to manage events, invite guests, and track RSVP status."
              : isSignUp
              ? "Start building your event in minutes with a free account."
              : isForgotPassword
              ? "Enter your email below and we'll send you instructions to reset your password."
              : "Use the auth controls below to continue."}
          </p>
        </div>

        <div className="mt-5">
          <AuthView path={path} redirectTo={redirectTo} />
        </div>
      </div>
    </main>
  );
}