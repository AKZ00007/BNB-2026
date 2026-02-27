'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/providers/auth-provider';

export default function SignupPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [organization, setOrganization] = useState('');
    const [role, setRole] = useState('creator');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // If already logged in, redirect to dashboard
    if (user) {
        router.push('/dashboard');
        return null;
    }

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!name.trim()) {
            setError('Please enter your name.');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: name.trim(),
                    organization: organization.trim() || null,
                    role: role,
                },
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        // If Supabase returns a session immediately (email confirmation disabled),
        // go straight to dashboard
        if (data.session) {
            router.push('/dashboard');
            return;
        }

        // Otherwise show email confirmation screen
        setSuccess(true);
        setLoading(false);
    }

    async function handleGoogleSignup() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        });
        if (error) setError(error.message);
    }

    if (success) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-950 flex flex-col justify-center items-center px-6 transition-colors">
                <div className="sm:mx-auto sm:w-full sm:max-w-[400px] text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#111827] dark:text-white mb-2">Check your email</h2>
                    <p className="text-sm text-[#6B7280] dark:text-gray-400 mb-6">
                        We sent a confirmation link to <strong className="text-gray-900 dark:text-gray-200">{email}</strong>. Click it to activate your account.
                    </p>
                    <Link href="/login">
                        <Button variant="outline">Go to Login</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex transition-colors">
            {/* Left Pane - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-6 lg:px-8 lg:flex-none lg:w-[520px] xl:w-[600px]">
                <div className="absolute top-8 left-8">
                    <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to home
                    </Link>
                </div>

                <div className="mx-auto w-full max-w-[420px]">
                    <div>
                        <h2 className="mt-6 text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
                            Create your account
                        </h2>
                        <p className="mt-2 text-sm text-[#6B7280] dark:text-gray-400">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        <form onSubmit={handleSignup} className="space-y-5">
                            {error && (
                                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">
                                    {error}
                                </div>
                            )}

                            {/* Full Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-[#374151] dark:text-gray-300">
                                    Full name <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Akshay Patel"
                                        className="appearance-none block w-full px-3 py-2 border border-[#E5E7EB] dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm placeholder-[#9CA3AF] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#374151] dark:text-gray-300">
                                    Email address <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="appearance-none block w-full px-3 py-2 border border-[#E5E7EB] dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm placeholder-[#9CA3AF] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-[#374151] dark:text-gray-300">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="At least 6 characters"
                                        className="appearance-none block w-full px-3 py-2 border border-[#E5E7EB] dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm placeholder-[#9CA3AF] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Organization / Project Name */}
                            <div>
                                <label htmlFor="organization" className="block text-sm font-medium text-[#374151] dark:text-gray-300">
                                    Organization / Project name
                                    <span className="text-[#9CA3AF] font-normal ml-1">(optional)</span>
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="organization"
                                        type="text"
                                        value={organization}
                                        onChange={e => setOrganization(e.target.value)}
                                        placeholder="AlphaDAO, MoonLabs, etc."
                                        className="appearance-none block w-full px-3 py-2 border border-[#E5E7EB] dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm placeholder-[#9CA3AF] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Role */}
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-[#374151] dark:text-gray-300">
                                    I want to
                                </label>
                                <div className="mt-1 grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setRole('creator')}
                                        className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${role === 'creator'
                                                ? 'border-primary bg-primary/5 text-primary dark:bg-primary/10'
                                                : 'border-[#E5E7EB] dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                                            }`}
                                    >
                                        🚀 Launch tokens
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRole('investor')}
                                        className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${role === 'investor'
                                                ? 'border-primary bg-primary/5 text-primary dark:bg-primary/10'
                                                : 'border-[#E5E7EB] dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                                            }`}
                                    >
                                        🔍 Scan & invest
                                    </button>
                                </div>
                            </div>

                            <div className="pt-1">
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating account...</>
                                    ) : (
                                        'Create your account'
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
                                    <span className="px-2 bg-white dark:bg-gray-950 text-[#9CA3AF]">Or sign up with</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Button variant="outline" className="w-full" onClick={handleGoogleSignup}>
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

            {/* Right Pane - Feature Highlight */}
            <div className="hidden lg:flex flex-1 bg-[#F9FAFB] dark:bg-gray-900 border-l border-[#E5E7EB] dark:border-gray-800 p-12 items-center justify-center relative overflow-hidden transition-colors">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-3xl rounded-full pointer-events-none" />

                <div className="max-w-[480px] relative z-10 space-y-8">
                    <h3 className="text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight">
                        Building tokenomics has never been this easy.
                    </h3>

                    <ul className="space-y-5">
                        <li className="flex gap-4">
                            <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                            <div>
                                <h4 className="font-bold text-[#111827] dark:text-white">Generate configs in seconds</h4>
                                <p className="text-sm text-[#6B7280] dark:text-gray-400 mt-1">Our AI creates the optimal tax and anti-whale structure instantly based on your prompt.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                            <div>
                                <h4 className="font-bold text-[#111827] dark:text-white">Battle-tested contracts</h4>
                                <p className="text-sm text-[#6B7280] dark:text-gray-400 mt-1">Foundations built on OpenZeppelin, meaning your liquidity is completely safe from logic exploits.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                            <div>
                                <h4 className="font-bold text-[#111827] dark:text-white">Launch with one click</h4>
                                <p className="text-sm text-[#6B7280] dark:text-gray-400 mt-1">Connect your wallet and deploy directly to BNB Chain through our Web3 integration.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
