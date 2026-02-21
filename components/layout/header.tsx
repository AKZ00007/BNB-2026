
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll } from 'framer-motion'
import { ConnectWallet } from '@/components/wallet/connect-button'

export function Header() {
    const [showMore, setShowMore] = useState(false)
    const { scrollY } = useScroll()
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        return scrollY.on('change', (latest) => {
            setIsScrolled(latest > 50)
        })
    }, [scrollY])

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-brand-charcoal/75 backdrop-blur-md border-b border-white/10'
                    : 'bg-transparent border-b border-transparent'
                }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-cyan flex items-center justify-center shadow-lg shadow-gold/20 group-hover:scale-105 transition-transform">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="#050505" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                        BNB Launchpad
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
                    <Link href="/create" className="hover:text-white transition-colors duration-200">Create</Link>
                    <Link href="/templates" className="hover:text-white transition-colors duration-200">Templates</Link>
                    <Link href="/explorer" className="hover:text-white transition-colors duration-200">Explorer</Link>
                    <Link href="/dashboard" className="hover:text-white transition-colors duration-200">Dashboard</Link>

                    {/* More dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={() => setShowMore(true)}
                        onMouseLeave={() => setShowMore(false)}
                    >
                        <button className="hover:text-white transition-colors duration-200 flex items-center gap-1">
                            More <span className="text-xs">▾</span>
                        </button>
                        {showMore && (
                            <div className="absolute top-full right-0 mt-2 w-48 py-2 rounded-xl border border-white/10 bg-brand-charcoal/95 backdrop-blur-md shadow-xl">
                                <Link href="/amm" className="block px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                                    ⚙️ AMM Customization
                                </Link>
                                <Link href="/growth" className="block px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                                    🌱 Growth Tools
                                </Link>
                                <Link href="/plu" className="block px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                                    🔒 PLU Dashboard
                                </Link>
                                <Link href="/launchpad" className="block px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                                    🚀 Launchpad
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Actions — Source gradient ring button style */}
                <div className="flex items-center gap-4">
                    <ConnectWallet />
                </div>
            </div>
        </motion.header>
    )
}
