import { Suspense } from "react";
import { PublicLayout } from "@/components/public-layout";
import { SocialLoginButtons } from "@/components/social-login-buttons";

export default async function AuthPage() {
  return (
    <PublicLayout>
      <div className="flex flex-1 items-start justify-center pt-12 md:items-center md:pt-0 min-h-[60vh]">
        <div className="flex w-full max-w-2xl flex-col gap-6 px-4">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <h3 className="font-semibold text-xl dark:text-zinc-50">Account</h3>
            <p className="text-gray-500 text-sm dark:text-zinc-400">
              Sign in with any social account to save chat history and access team features.
            </p>
          </div>
          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            }
          >
            <SocialLoginButtons />
          </Suspense>
        </div>
      </div>
    </PublicLayout>
  );
}
