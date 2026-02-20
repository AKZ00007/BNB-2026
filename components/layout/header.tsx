
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ConnectWallet } from '@/components/wallet/connect-button'

export function Header() {
    const [showMore, setShowMore] = useState(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 glass-card-prominent backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-purple flex items-center justify-center text-bg-base font-bold text-lg group-hover:scale-105 transition-transform">
                        🚀
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold to-white">
                        LaunchPad AI
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-secondary">
                    <Link href="/create" className="hover:text-gold transition-colors">Create</Link>
                    <Link href="/templates" className="hover:text-gold transition-colors">Templates</Link>
                    <Link href="/dashboard" className="hover:text-gold transition-colors">Dashboard</Link>

                    {/* More dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={() => setShowMore(true)}
                        onMouseLeave={() => setShowMore(false)}
                    >
                        <button className="hover:text-gold transition-colors flex items-center gap-1">
                            More <span className="text-xs">▾</span>
                        </button>
                        {showMore && (
                            <div className="absolute top-full right-0 mt-2 w-48 py-2 rounded-xl border border-white/10 bg-bg-card/95 backdrop-blur-md shadow-xl">
                                <Link href="/amm" className="block px-4 py-2 text-sm text-text-secondary hover:text-gold hover:bg-white/5 transition-colors">
                                    ⚙️ AMM Customization
                                </Link>
                                <Link href="/growth" className="block px-4 py-2 text-sm text-text-secondary hover:text-gold hover:bg-white/5 transition-colors">
                                    🌱 Growth Tools
                                </Link>
                                <Link href="/plu" className="block px-4 py-2 text-sm text-text-secondary hover:text-gold hover:bg-white/5 transition-colors">
                                    🔒 PLU Dashboard
                                </Link>
                                <Link href="/launchpad" className="block px-4 py-2 text-sm text-text-secondary hover:text-gold hover:bg-white/5 transition-colors">
                                    🚀 Launchpad
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <ConnectWallet />
                </div>
            </div>
        </header>
    )
}
