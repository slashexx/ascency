'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: { [key: string]: string } = {
    OAuthSignin: "Error in the OAuth sign-in process. Please try again.",
    OAuthCallback: "Error in the OAuth callback. Please try again.",
    OAuthCreateAccount: "Could not create OAuth account. Please try again.",
    EmailCreateAccount: "Could not create email account. Please try again.",
    Callback: "Error in the callback. Please try again.",
    OAuthAccountNotLinked: "Email already exists with different provider.",
    EmailSignin: "Check your email address.",
    CredentialsSignin: "Invalid credentials.",
    SessionRequired: "Please sign in to access this page.",
    Default: "Unable to sign in.",
  };

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-sm rounded-lg border border-gray-700 bg-gray-900 p-8">
        <div className="mb-8 text-center">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-red-400">
            {errorMessage}
          </p>
        </div>

        <Link
          href="/auth"
          className="flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-black text-white">Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
} 