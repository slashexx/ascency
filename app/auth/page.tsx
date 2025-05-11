'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Github } from 'lucide-react';

export default function SignIn() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError(result.error);
        } else {
          router.push('/');
        }
      } else {
        // Register new user
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Something went wrong');
        }

        // Sign in after successful registration
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError(result.error);
        } else {
          router.push('/');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-sm rounded-lg border border-gray-700 bg-gray-900 p-8">
        <div className="mb-8 text-center">
          <Github className="mx-auto h-10 w-10 text-white" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            {isLogin ? 'Sign in to your account' : 'Create an account'}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {isLogin ? 'Use your credentials to continue' : 'Fill in your details to get started'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
          >
            {isLoading ? 'Please wait...' : (isLogin ? 'Sign in' : 'Create account')}
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-center text-sm text-gray-400 hover:text-white"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="mx-4 text-sm text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <button
          onClick={() => signIn('github', { callbackUrl: '/' })}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <Github className="h-5 w-5" />
          Continue with GitHub
        </button>
      </div>
    </div>
  );
}