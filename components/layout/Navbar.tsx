'use client'
import Link from 'next/link'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { ChevronDown, Zap, Shield, Sparkles, BarChart, Rocket, LayoutGrid, LineChart, FileText, Radio, ShieldCheck } from 'lucide-react'
import { ConnectWallet } from '@/components/wallet/connect-button'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'

export default function Navbar() {
    return (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-[1200px] mx-auto px-8 h-16 flex items-center justify-between">
                {/* Logo block */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0" y="0" width="12" height="12" rx="1" className="fill-gray-900 dark:fill-gray-100 group-hover:fill-primary dark:group-hover:fill-primary transition-colors" />
                            <rect x="14" y="2" width="9" height="9" rx="1" className="fill-gray-900 dark:fill-gray-100 group-hover:fill-primary dark:group-hover:fill-primary transition-colors delay-75" />
                            <rect x="2" y="14" width="9" height="9" rx="1" className="fill-gray-900 dark:fill-gray-100 group-hover:fill-primary dark:group-hover:fill-primary transition-colors delay-100" />
                            <rect x="14" y="14" width="7" height="7" rx="1" className="fill-gray-900 dark:fill-gray-100 group-hover:fill-primary dark:group-hover:fill-primary transition-colors delay-150" />
                        </svg>
                    </div>
                    <span className="font-bold text-base text-gray-900 dark:text-gray-100 transition-colors">GROWUP AI</span>
                </Link>

                {/* Radix Navigation */}
                <NavigationMenu.Root className="relative flex justify-center z-[1] hidden md:flex">
                    <NavigationMenu.List className="flex items-center gap-6 m-0 p-0 list-none">
                        <NavigationMenu.Item>
                            <NavigationMenu.Trigger className="flex items-center gap-1 font-medium text-[15px] text-gray-900 dark:text-gray-100 hover:text-primary transition-colors group">
                                Features
                                <ChevronDown className="w-4 h-4 text-gray-400 group-data-[state=open]:rotate-180 transition-transform duration-200" />
                            </NavigationMenu.Trigger>
                            <NavigationMenu.Content className="top-0 left-0 w-full md:absolute md:w-auto p-4">
                                <div className="w-[480px] grid grid-cols-[200px_1fr] gap-4">
                                    <NavigationMenu.Link asChild>
                                        <Link href="/create" className="bg-[#FFF0F0] dark:bg-primary/10 rounded-lg p-4 flex flex-col justify-end group/card hover:bg-primary-ultra transition-colors">
                                            <Zap className="w-6 h-6 text-primary mb-6 group-hover/card:scale-110 transition-transform" />
                                            <h3 className="font-bold text-[16px] text-gray-900 dark:text-gray-100 mb-1 group-hover/card:text-primary transition-colors">Token Designer</h3>
                                            <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-snug">Generate smart tokenomics automatically via AI</p>
                                        </Link>
                                    </NavigationMenu.Link>
                                    <div className="flex flex-col gap-1 py-1">
                                        <NavigationMenu.Link asChild>
                                            <Link href="/templates" className="block p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group/link">
                                                <h4 className="font-bold text-[14px] text-gray-900 dark:text-gray-100 flex items-center gap-2 group-hover/link:text-primary transition-colors"><LayoutGrid className="w-4 h-4 text-gray-400 group-hover/link:text-primary" /> Token Templates</h4>
                                                <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">Ready-made, pre-audited token structures.</p>
                                            </Link>
                                        </NavigationMenu.Link>
                                        <NavigationMenu.Link asChild>
                                            <Link href="/amm" className="block p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group/link">
                                                <h4 className="font-bold text-[14px] text-gray-900 dark:text-gray-100 flex items-center gap-2 group-hover/link:text-primary transition-colors"><BarChart className="w-4 h-4 text-gray-400 group-hover/link:text-primary" /> AMM & Liquidity</h4>
                                                <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">Perfect liquidity ratios & anti-whaling.</p>
                                            </Link>
                                        </NavigationMenu.Link>
                                        <NavigationMenu.Link asChild>
                                            <Link href="/plu" className="block p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group/link">
                                                <h4 className="font-bold text-[14px] text-gray-900 dark:text-gray-100 flex items-center gap-2 group-hover/link:text-primary transition-colors"><Shield className="w-4 h-4 text-gray-400 group-hover/link:text-primary" /> Token Vesting (PLU)</h4>
                                                <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">Time-locked OpenZeppelin distribution.</p>
                                            </Link>
                                        </NavigationMenu.Link>
                                    </div>
                                </div>
                            </NavigationMenu.Content>
                        </NavigationMenu.Item>

                        <NavigationMenu.Item>
                            <NavigationMenu.Trigger className="flex items-center gap-1 font-medium text-[15px] text-gray-900 dark:text-gray-100 hover:text-primary transition-colors group">
                                Solutions
                                <ChevronDown className="w-4 h-4 text-gray-400 group-data-[state=open]:rotate-180 transition-transform duration-200" />
                            </NavigationMenu.Trigger>
                            <NavigationMenu.Content className="top-0 left-0 w-full md:absolute md:w-auto p-6">
                                <div className="w-[560px] grid grid-cols-2 gap-x-8 gap-y-4">
                                    <NavigationMenu.Link asChild>
                                        <Link href="/launchpad" className="block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group/link border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                            <h4 className="font-bold text-[14px] text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-1 group-hover/link:text-primary transition-colors"><Rocket className="w-4 h-4 text-gray-400 group-hover/link:text-primary" /> GROWUP AI</h4>
                                            <p className="text-[13px] text-gray-500 dark:text-gray-400">Deploy memecoins & utility tokens directly to the blockchain securely.</p>
                                        </Link>
                                    </NavigationMenu.Link>
                                    <NavigationMenu.Link asChild>
                                        <Link href="/growth" className="block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group/link border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                            <h4 className="font-bold text-[14px] text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-1 group-hover/link:text-primary transition-colors"><LineChart className="w-4 h-4 text-gray-400 group-hover/link:text-primary" /> Post-Launch Growth</h4>
                                            <p className="text-[13px] text-gray-500 dark:text-gray-400">Holder lifecycle tracking, price alerts, and distribution analytics.</p>
                                        </Link>
                                    </NavigationMenu.Link>
                                    <NavigationMenu.Link asChild>
                                        <Link href="/dashboard" className="block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group/link border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                            <h4 className="font-bold text-[14px] text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-1 group-hover/link:text-primary transition-colors"><FileText className="w-4 h-4 text-gray-400 group-hover/link:text-primary" /> My Config Dashboard</h4>
                                            <p className="text-[13px] text-gray-500 dark:text-gray-400">Manage, edit, and resume your saved tokenomic configurations.</p>
                                        </Link>
                                    </NavigationMenu.Link>
                                    <NavigationMenu.Link asChild>
                                        <Link href="/scanner" className="block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group/link border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                            <h4 className="font-bold text-[14px] text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-1 group-hover/link:text-primary transition-colors"><ShieldCheck className="w-4 h-4 text-gray-400 group-hover/link:text-primary" /> Risk Scanner</h4>
                                            <p className="text-[13px] text-gray-500 dark:text-gray-400">AI-powered token safety analysis for any BNB Chain contract.</p>
                                        </Link>
                                    </NavigationMenu.Link>
                                    <NavigationMenu.Link asChild>
                                        <Link href="/live" className="block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group/link border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                            <h4 className="font-bold text-[14px] text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-1 group-hover/link:text-primary transition-colors"><Radio className="w-4 h-4 text-gray-400 group-hover/link:text-primary" /> Live Monitoring</h4>
                                            <p className="text-[13px] text-gray-500 dark:text-gray-400">Real-time BNB Chain event feed with AI-translated alerts.</p>
                                        </Link>
                                    </NavigationMenu.Link>
                                </div>
                            </NavigationMenu.Content>
                        </NavigationMenu.Item>

                        <NavigationMenu.Item>
                            <Link href="/docs" className="block text-[15px] font-medium text-gray-900 dark:text-gray-100 hover:text-primary transition-colors">
                                Docs
                            </Link>
                        </NavigationMenu.Item>
                    </NavigationMenu.List>

                    <div className="perspective-[2000px] absolute top-full left-1/2 -translate-x-1/2 flex justify-center">
                        <NavigationMenu.Viewport className="relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-xl bg-white dark:bg-gray-950 border border-transparent dark:border-gray-800 shadow-lg transition-[width,_height] duration-300 data-[state=closed]:animate-scale-out data-[state=open]:animate-scale-in sm:w-[var(--radix-navigation-menu-viewport-width)]" />
                    </div>
                </NavigationMenu.Root>

                {/* CTAs */}
                <div className="flex items-center gap-3">
                    <AnimatedThemeToggler />
                    <Link href="/login" className="border border-gray-200 dark:border-gray-800 rounded-full px-4 py-2 text-[14px] font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors hidden sm:block">
                        Login
                    </Link>
                    <div className="scale-90 sm:scale-100 origin-right">
                        <ConnectWallet />
                    </div>
                </div>
            </div>
        </div>
    )
}
