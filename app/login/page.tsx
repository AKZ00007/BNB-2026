'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/providers/auth-provider';

export default function LoginPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // If already logged in, redirect to dashboard
    if (user) {
        router.push('/dashboard');
        return null;
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        router.push('/dashboard');
    }

    async function handleGoogleLogin() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        });
        if (error) setError(error.message);
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-950 flex flex-col justify-center py-12 px-6 lg:px-8 transition-colors">
            <div className="absolute top-8 left-8">
                <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to home
                </Link>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-[400px]">
                <div className="flex justify-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
                    Welcome back
                </h2>
                <p className="mt-2 text-center text-sm text-[#6B7280] dark:text-gray-400">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                        Start for free
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px]">
                <div className="bg-white dark:bg-gray-900 py-8 px-8 shadow-sm border border-[#E5E7EB] dark:border-gray-800 rounded-2xl transition-colors">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#374151] dark:text-gray-300">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-[#E5E7EB] dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm placeholder-[#9CA3AF] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[#374151] dark:text-gray-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-[#E5E7EB] dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm placeholder-[#9CA3AF] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Signing in...</>
                                ) : (
                                    'Sign in'
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#E5E7EB] dark:border-gray-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-gray-900 text-[#9CA3AF]">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
