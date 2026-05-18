import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Sign In | Twelve Creative",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-xl text-base font-bold">
            12
          </div>
          <div>
            <h1 className="font-heading text-foreground text-2xl font-medium tracking-tight">
              Sign in to Admin
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Twelve Creative control panel.
            </p>
          </div>
        </div>

        <div className="bg-card border-border/60 rounded-2xl border p-6 sm:p-7">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-muted-foreground mt-6 text-center text-xs">
          Trouble signing in? Reach the project lead for a password reset.
        </p>
      </div>
    </div>
  );
}
