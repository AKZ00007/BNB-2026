'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home, Search, Book, FolderOpen, Star, Users,
    MoreHorizontal, Gift, Zap, Edit2, ChevronDown, FileText, Bell
} from 'lucide-react';

const RECENT_PROJECTS = [
    { name: 'Block Anchor' },
    { name: 'Aesthetic Threads Collective' },
    { name: 'Retro Resume OS' },
    { name: 'Aesthetic Threads' },
    { name: 'Fat Cow Canvas' },
];

export function WizardSidebar() {
    const pathname = usePathname();

    const mainNav = [
        { href: '/create', label: 'Home', icon: Home },
        { href: '/explorer', label: 'Search', icon: Search },
        { href: '/templates', label: 'Resources', icon: Book },
    ];

    const projectsNav = [
        { href: '/dashboard', label: 'All projects', icon: FolderOpen },
        { href: '/dashboard', label: 'Starred', icon: Star },
        { href: '/dashboard', label: 'Shared with me', icon: Users },
    ];

    const renderNavItem = (item: any) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
            <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${isActive
                    ? 'bg-[#1a1a1a] text-white'
                    : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
                    }`}
            >
                <Icon strokeWidth={1.5} className="w-[18px] h-[18px]" />
                {item.label}
            </Link>
        );
    };

    return (
        <aside className="hidden lg:flex flex-col w-[260px] h-full bg-[#0c0c0c] border-r border-[#1F2937] text-gray-300 flex-shrink-0 z-20">

            {/* Workspace Switcher */}
            <div className="p-3">
                <button className="w-full flex items-center justify-between p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                            A
                        </div>
                        <span className="font-medium text-[13px] text-gray-200 group-hover:text-white transition-colors">
                            Akshay's GROWUP AI
                        </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-300" strokeWidth={1.5} />
                </button>
            </div>

            {/* Scrollable Nav Area */}
            <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4 mt-2">

                {/* Main Nav */}
                <div className="space-y-0.5 mb-8">
                    {mainNav.map(renderNavItem)}
                </div>

                {/* Projects Group */}
                <div className="mb-8">
                    <div className="px-3 mb-2 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-gray-500 tracking-wide">Projects</span>
                    </div>
                    <div className="space-y-0.5">
                        {projectsNav.map(renderNavItem)}
                    </div>
                </div>

                {/* Recents Group */}
                <div>
                    <div className="px-3 mb-2 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-gray-500 tracking-wide">Recents</span>
                    </div>
                    <div className="space-y-0.5">
                        {RECENT_PROJECTS.map((project, i) => (
                            <Link key={i} href="/dashboard" className="group relative flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium text-gray-400 hover:bg-[#1a1a1a] hover:text-white transition-colors cursor-pointer">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <FileText strokeWidth={1.5} className="w-[18px] h-[18px] flex-shrink-0 opacity-70 group-hover:opacity-100" />
                                    <span className="truncate">{project.name}</span>
                                </div>
                                <div className="hidden group-hover:flex items-center gap-1 bg-[#1a1a1a] pl-2 absolute right-2">
                                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="p-1 hover:text-white text-gray-500 transition-colors">
                                        <Edit2 strokeWidth={1.5} className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="p-1 hover:text-white text-gray-500 transition-colors">
                                        <MoreHorizontal strokeWidth={1.5} className="w-4 h-4" />
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Footer Area */}
            <div className="p-4 space-y-3 border-t border-[#1F2937]/50 mt-auto">
                {/* Share Card */}
                <div className="bg-[#111111] border border-[#1f1f1f] rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-[#151515] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                        <Gift strokeWidth={1.5} className="w-4 h-4 text-gray-300" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-gray-200">Share GROWUP AI</span>
                        <span className="text-[11px] text-gray-500">100 credits per paid referral</span>
                    </div>
                </div>

                {/* Upgrade Banner */}
                <div className="relative rounded-xl p-[1px] bg-gradient-to-r from-[#9900FF] to-[#00CCFF] cursor-pointer group">
                    <div className="bg-[#0c0c0c] rounded-xl p-3 flex items-center gap-3 group-hover:bg-opacity-80 transition-all">
                        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                            <Zap strokeWidth={1.5} className="w-4 h-4 text-[#22D3EE]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[13px] font-medium text-white">Upgrade to Pro</span>
                            <span className="text-[11px] text-gray-400">Unlock more benefits</span>
                        </div>
                    </div>
                </div>

                {/* User Profile */}
                <div className="flex items-center justify-between pt-2">
                    <button className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 flex items-center justify-center text-[10px] font-bold text-white border border-[#2a2a2a]">
                            AK
                        </div>
                    </button>
                    <button className="p-2 text-gray-500 hover:text-white transition-colors relative">
                        <Bell strokeWidth={1.5} className="w-4 h-4" />
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-[#0c0c0c]"></div>
                    </button>
                </div>
            </div>
        </aside>
    );
}
