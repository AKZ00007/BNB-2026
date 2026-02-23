'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Mic, ArrowUp, ArrowRight, Box, Layers, Layout, Globe, Zap, Shield, Coins, Bot, Rocket, Star, Clock, Users } from 'lucide-react';
import { TOKEN_TEMPLATES } from '@/lib/templates';
import { getSavedProjects, type SavedProject } from '@/lib/projects-store';

type TabKey = 'recent' | 'projects' | 'templates';

const RECENT_PROJECTS = [
    { title: 'Block Anchor', time: 'Viewed 53 seconds ago', icon: <Box className="w-12 h-12 text-cyan-400" />, route: '/dashboard' },
    { title: 'Aesthetic Threads Collective', time: 'Viewed 38 minutes ago', icon: <Layers className="w-12 h-12 text-yellow-400" />, route: '/dashboard' },
    { title: 'Retro Resume OS', time: 'Viewed 11 days ago', icon: <Layout className="w-12 h-12 text-green-400" />, route: '/dashboard' },
    { title: 'Aesthetic Threads', time: 'Viewed 12 days ago', icon: <Globe className="w-12 h-12 text-purple-400" />, route: '/dashboard' },
];



const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
    meme: <Rocket className="w-12 h-12 text-pink-400" />,
    defi: <Coins className="w-12 h-12 text-blue-400" />,
    dao: <Users className="w-12 h-12 text-emerald-400" />,
    ai: <Bot className="w-12 h-12 text-purple-400" />,
    gaming: <Star className="w-12 h-12 text-yellow-400" />,
};

const TABS: { key: TabKey; label: string }[] = [
    { key: 'recent', label: 'Recently viewed' },
    { key: 'projects', label: 'My projects' },
    { key: 'templates', label: 'Templates' },
];

interface GoalInputStepProps {
    onSubmit: (goal: string) => void;
}

export function GoalInputStep({ onSubmit }: GoalInputStepProps) {
    const [goal, setGoal] = useState('');
    const [activeTab, setActiveTab] = useState<TabKey>('recent');
    const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
    const router = useRouter();

    // Load saved projects from localStorage
    useEffect(() => {
        setSavedProjects(getSavedProjects());
    }, []);

    const handleSubmit = () => {
        if (goal.trim().length > 0) onSubmit(goal.trim());
    };

    const handleApplyTemplate = (template: typeof TOKEN_TEMPLATES[0]) => {
        sessionStorage.setItem('template_config', JSON.stringify(template.config));
        sessionStorage.setItem('template_name', template.name);
        router.push('/create?template=true');
    };

    return (
        <div className="relative w-full flex flex-col">

            {/* Inline keyframes for fluid blob animation */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float-slow {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.05); }
                    66% { transform: translate(-20px, 20px) scale(0.95); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: float-slow 10s infinite alternate ease-in-out;
                }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
            `}} />

            {/* Ambient Background Gradients (Lovable style) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-50 dark:bg-[#09090b]">
                <div className="absolute top-[-10%] left-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[#FF3366]/20 blur-[130px] rounded-full mix-blend-screen animate-blob" />
                <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[#9900FF]/20 blur-[120px] rounded-full mix-blend-screen animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] bg-[#00CCFF]/15 blur-[140px] rounded-full mix-blend-screen animate-blob animation-delay-4000" />
            </div>

            {/* Central Command Area — fills viewport so tabs peek from bottom */}
            <div className="w-full max-w-[800px] mx-auto px-4 animate-fade-in relative z-10 flex flex-col items-center justify-center pt-[10vh] pb-[5vh]" style={{ minHeight: 'calc(100vh - 260px)' }}>
                <h1 className="text-[24px] sm:text-[28px] font-semibold text-slate-900 dark:text-white text-center mb-6 tracking-tight transition-colors">
                    Ready to build, Akshay?
                </h1>

                <div className="relative group w-full max-w-[720px]">
                    <textarea
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="Ask GROWUP AI to create a..."
                        className="w-full min-h-[80px] sm:min-h-[88px] bg-white/70 dark:bg-[rgba(20,20,20,0.65)] backdrop-blur-[24px] border border-slate-200 dark:border-white/10 rounded-2xl p-5 pb-14 text-[14px] text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 resize-none outline-none focus:border-pink-300 dark:focus:border-white/20 transition-all leading-relaxed shadow-xl dark:shadow-2xl"
                        maxLength={2000}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />

                    {/* Floating Command Controls */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-transparent">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                            <Plus strokeWidth={2} className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-1 sm:gap-3">
                            {/* Plan Toggle */}
                            <div className="flex items-center gap-2 mr-1 sm:mr-3 border-r border-slate-200 dark:border-white/10 pr-3 sm:pr-5 transition-colors">
                                <span className="text-[13px] font-medium text-slate-600 dark:text-gray-300">Plan</span>
                                <button className="w-[30px] h-[16px] rounded-full bg-[#22D3EE]/20 relative flex items-center p-[2px] cursor-pointer">
                                    <div className="w-3 h-3 bg-[#22D3EE] rounded-full hover:scale-110 transition-transform"></div>
                                </button>
                            </div>

                            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                                <Mic strokeWidth={2} className="w-4 h-4" />
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={goal.trim().length === 0}
                                className="w-8 h-8 ml-1 rounded-full bg-slate-900 text-white dark:bg-white flex items-center justify-center dark:text-black disabled:opacity-30 disabled:bg-slate-300 dark:disabled:bg-gray-500/50 disabled:text-slate-500 dark:disabled:text-gray-400 hover:scale-105 active:scale-95 transition-all shadow-md dark:shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:shadow-none"
                            >
                                <ArrowUp strokeWidth={3} className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Grid Section — peeks from bottom, scroll to reveal */}
            <div className="w-full max-w-[1200px] mx-auto px-6 sm:px-10 pt-8 sm:pt-10 pb-12 bg-white/80 dark:bg-[#121212]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/5 rounded-t-[32px] sm:rounded-t-[40px] animate-fade-in relative z-10 shadow-xl dark:shadow-2xl flex-1 transition-colors" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                {/* Tabs */}
                <div className="flex items-center gap-2 sm:gap-4 mb-8 relative">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`text-[14px] font-medium px-4 py-2 rounded-xl transition-all ${activeTab === tab.key
                                ? 'bg-slate-200 text-slate-900 dark:bg-white/10 dark:text-white'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}

                    <button
                        onClick={() => {
                            if (activeTab === 'templates') router.push('/templates');
                            else if (activeTab === 'projects') router.push('/dashboard');
                        }}
                        className="ml-auto text-[14px] font-medium text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-1.5 transition-colors px-4 py-2"
                    >
                        Browse all <ArrowRight strokeWidth={2} className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'recent' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {RECENT_PROJECTS.map((item, i) => (
                            <div
                                key={i}
                                onClick={() => router.push(item.route)}
                                className="group flex flex-col bg-white/60 dark:bg-[rgba(15,15,15,0.7)] backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:border-pink-300 dark:hover:border-white/10"
                            >
                                <div className="aspect-video bg-[#050505] flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-50 group-hover:opacity-30 transition-opacity" />
                                    <div className="z-0 transform group-hover:scale-110 transition-transform duration-700 ease-out">
                                        {item.icon}
                                    </div>
                                </div>
                                <div className="p-4 flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white shadow-inner">
                                        AK
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-[13px] font-semibold text-slate-800 dark:text-gray-200 truncate group-hover:text-pink-600 dark:group-hover:text-white transition-colors">{item.title}</h4>
                                        <p className="text-[11px] text-slate-500 dark:text-gray-500 mt-0.5">{item.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'projects' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {savedProjects.length === 0 && (
                            <div className="sm:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-16 text-center">
                                <Coins className="w-14 h-14 text-slate-300 dark:text-gray-600 mb-4" strokeWidth={1} />
                                <h4 className="text-[15px] font-semibold text-slate-700 dark:text-gray-300 mb-1">No tokens yet</h4>
                                <p className="text-[13px] text-slate-500 dark:text-gray-500 max-w-sm">Create your first token using the AI prompt above. It will appear here once deployed.</p>
                            </div>
                        )}
                        {savedProjects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => router.push('/dashboard')}
                                className="group flex flex-col bg-white/60 dark:bg-[rgba(15,15,15,0.7)] backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl dark:shadow-lg dark:hover:shadow-2xl hover:border-pink-300 dark:hover:border-white/10"
                            >
                                <div className="aspect-video bg-slate-100 dark:bg-[#050505] flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-50 group-hover:opacity-30 transition-opacity" />
                                    <div className="z-0 transform group-hover:scale-110 transition-transform duration-700 ease-out flex flex-col items-center">
                                        <span className="text-3xl font-bold text-[#22D3EE]">${project.tokenSymbol}</span>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white shadow-inner">
                                            AK
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-[13px] font-semibold text-slate-800 dark:text-gray-200 truncate group-hover:text-pink-600 dark:group-hover:text-white transition-colors">{project.tokenName}</h4>
                                            <p className="text-[11px] text-slate-500 dark:text-gray-500 mt-0.5">{formatTimeAgo(project.createdAt)}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border text-emerald-400 bg-emerald-400/10 border-emerald-400/20">
                                        {project.status}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Create New Card */}
                        <div
                            onClick={() => {
                                setActiveTab('recent');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="group flex flex-col items-center justify-center bg-slate-50/50 dark:bg-[rgba(15,15,15,0.4)] backdrop-blur-md border border-dashed border-slate-300 dark:border-white/10 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl dark:shadow-lg dark:hover:shadow-2xl hover:border-pink-400 dark:hover:border-[#22D3EE]/30 min-h-[200px]"
                        >
                            <Plus className="w-10 h-10 text-slate-400 dark:text-gray-500 group-hover:text-pink-500 dark:group-hover:text-[#22D3EE] transition-colors mb-3" strokeWidth={1.5} />
                            <span className="text-[13px] font-medium text-slate-500 dark:text-gray-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Create new project</span>
                        </div>
                    </div>
                )}

                {activeTab === 'templates' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {TOKEN_TEMPLATES.slice(0, 8).map((template, i) => (
                            <div
                                key={i}
                                onClick={() => handleApplyTemplate(template)}
                                className="group flex flex-col bg-white/60 dark:bg-[rgba(15,15,15,0.7)] backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl dark:shadow-lg dark:hover:shadow-2xl hover:border-pink-300 dark:hover:border-white/10"
                            >
                                <div className="aspect-video bg-slate-100 dark:bg-[#050505] flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-50 group-hover:opacity-30 transition-opacity" />
                                    <div className="z-0 transform group-hover:scale-110 transition-transform duration-700 ease-out">
                                        {TEMPLATE_ICONS[template.category] || <Coins className="w-12 h-12 text-gray-400" />}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-[13px] font-semibold text-slate-800 dark:text-gray-200 truncate group-hover:text-pink-600 dark:group-hover:text-white transition-colors">{template.name}</h4>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-gray-500 line-clamp-2 leading-relaxed">{template.description}</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-pink-100/50 dark:bg-[#22D3EE]/10 text-pink-500 dark:text-[#22D3EE] border border-pink-200 dark:border-[#22D3EE]/20">
                                            {template.category}
                                        </span>
                                        <span className="text-[10px] text-slate-500 dark:text-gray-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> 2 min setup
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}

function formatTimeAgo(isoDate: string): string {
    const diff = Date.now() - new Date(isoDate).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
}
