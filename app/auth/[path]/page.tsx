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
  const redirectTo = path === "sign-out" ? "/" : undefined;

  return (
    <main className="flex flex-1 items-center justify-center py-16 md:pt-14.5">
      <div className="w-full max-w-md">
        <div className="space-y-0.5">
          <h1
            className={`text-2xl font-semibold tracking-tight`}
          >
            {isSignIn
              ? "Welcome back to Gathr"
              : isSignUp
              ? "Create your account"
              : isForgotPassword
              ? "Reset your password"
              : "Manage your account"}
          </h1>
          <p className={`text-sm leading-6 ${isSignIn ? "text-slate-600" : "text-slate-500"}`}>
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