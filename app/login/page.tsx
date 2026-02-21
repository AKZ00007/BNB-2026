import Link from 'next/link'
import { ArrowLeft, Rocket, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center py-12 px-6 lg:px-8">
            <div className="absolute top-8 left-8">
                <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group">
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
                <h2 className="text-center text-3xl font-extrabold text-[#111827] tracking-tight">
                    Welcome back
                </h2>
                <p className="mt-2 text-center text-sm text-[#6B7280]">
                    Don't have an account?{' '}
                    <Link href="/signup" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                        Start for free
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px]">
                <div className="bg-white py-8 px-8 shadow-sm border border-[#E5E7EB] rounded-2xl">
                    <form className="space-y-6" action="#" method="POST">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#374151]">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-[#E5E7EB] rounded-lg shadow-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[#374151]">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-[#E5E7EB] rounded-lg shadow-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary focus:ring-primary border-[#E5E7EB] rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#6B7280]">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <Button type="submit" className="w-full">
                                Sign in
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#E5E7EB]" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-[#9CA3AF]">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <Button variant="outline" className="w-full">
                                Google
                            </Button>
                            <Button variant="outline" className="w-full">
                                GitHub
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
