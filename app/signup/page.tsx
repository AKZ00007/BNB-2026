import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Pane - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-6 lg:px-8 lg:flex-none lg:w-[480px] xl:w-[560px]">
                <div className="absolute top-8 left-8">
                    <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to home
                    </Link>
                </div>

                <div className="mx-auto w-full max-w-[400px]">
                    <div>
                        <h2 className="mt-6 text-3xl font-extrabold text-[#111827] tracking-tight">
                            Get started for free
                        </h2>
                        <p className="mt-2 text-sm text-[#6B7280]">
                            Already registered?{' '}
                            <Link href="/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                                Sign in to your account
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        <div className="mt-6">
                            <form action="#" method="POST" className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-[#374151]">
                                        Full name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            required
                                            className="appearance-none block w-full px-3 py-2 border border-[#E5E7EB] rounded-lg shadow-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                        />
                                    </div>
                                </div>

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
                                            autoComplete="new-password"
                                            required
                                            className="appearance-none block w-full px-3 py-2 border border-[#E5E7EB] rounded-lg shadow-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Button type="submit" className="w-full">
                                        Create your account
                                    </Button>
                                </div>
                            </form>

                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-[#E5E7EB]" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-[#9CA3AF]">Or sign up with</span>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3">
                                    <Button variant="outline" className="w-full">Google</Button>
                                    <Button variant="outline" className="w-full">GitHub</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Pane - Feature Highlight */}
            <div className="hidden lg:flex flex-1 bg-[#F9FAFB] border-l border-[#E5E7EB] p-12 items-center justify-center relative overflow-hidden">
                {/* Subtle decorative blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-3xl rounded-full pointer-events-none" />

                <div className="max-w-[480px] relative z-10 space-y-8">
                    <h3 className="text-3xl font-extrabold text-[#111827] tracking-tight">
                        Building tokenomics has never been this easy.
                    </h3>

                    <ul className="space-y-5">
                        <li className="flex gap-4">
                            <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                            <div>
                                <h4 className="font-bold text-[#111827]">Generate configs in seconds</h4>
                                <p className="text-sm text-[#6B7280] mt-1">Our AI creates the optimal tax and anti-whale structure instantly based on your prompt.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                            <div>
                                <h4 className="font-bold text-[#111827]">Battle-tested contracts</h4>
                                <p className="text-sm text-[#6B7280] mt-1">Foundations built on OpenZeppelin, meaning your liquidity is completely safe from logic exploits.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                            <div>
                                <h4 className="font-bold text-[#111827]">Launch with one click</h4>
                                <p className="text-sm text-[#6B7280] mt-1">Connect via RainbowKit and deploy directly to Binance Smart Chain through our Web3 integration.</p>
                            </div>
                        </li>
                    </ul>

                    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex gap-4 mt-8 shadow-sm">
                        <div className="w-12 h-12 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-xl">D</div>
                        <div>
                            <p className="font-bold text-[#111827] text-sm">David S.</p>
                            <p className="text-xs text-[#6B7280] mb-2">Lead Developer @ AlphaDAO</p>
                            <p className="text-sm italic text-[#374151]">"I saved 2 weeks of development time using this launchpad. It just works."</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
