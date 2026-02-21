'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Radio, AlertTriangle, Shield, ShieldAlert, ShieldX,
    Activity, Anchor, TrendingDown, BarChart3, Users, Zap,
    Pause, Play, Trash2, Volume2, VolumeX,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LiveEvent {
    id: string;
    timestamp: string;
    type: string;
    severity: 'INFO' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    token: {
        address: string;
        name: string;
        symbol: string;
        isGuardian: boolean;
    };
    title: string;
    description: string;
    aiTranslation: string;
    wallet?: string;
    value?: string;
    contractAction?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSeverityConfig(severity: string) {
    switch (severity) {
        case 'INFO':
            return { color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20', dot: 'bg-cyan-400' };
        case 'MEDIUM':
            return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', dot: 'bg-yellow-400' };
        case 'HIGH':
            return { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', dot: 'bg-orange-400' };
        case 'CRITICAL':
            return { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', dot: 'bg-red-400' };
        default:
            return { color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20', dot: 'bg-gray-400' };
    }
}

function getEventIcon(type: string) {
    switch (type) {
        case 'whale_activity': return Users;
        case 'dev_wallet': return AlertTriangle;
        case 'lp_removal': return Anchor;
        case 'price_drop': return TrendingDown;
        case 'volume_anomaly': return BarChart3;
        case 'holder_flight': return Users;
        case 'guardian_action': return Shield;
        default: return Activity;
    }
}

function formatTime(ts: string) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LiveFeedPage() {
    const [events, setEvents] = useState<LiveEvent[]>([]);
    const [connected, setConnected] = useState(false);
    const [paused, setPaused] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [filter, setFilter] = useState<string>('all');
    const eventSourceRef = useRef<EventSource | null>(null);
    const feedRef = useRef<HTMLDivElement>(null);
    const maxEvents = 50;

    // ── Stats ─────────────────────────────────────────────────────────────────
    const stats = {
        total: events.length,
        critical: events.filter(e => e.severity === 'CRITICAL').length,
        high: events.filter(e => e.severity === 'HIGH').length,
        guardianActions: events.filter(e => e.type === 'guardian_action').length,
    };

    // ── Connect to SSE ────────────────────────────────────────────────────────
    useEffect(() => {
        const es = new EventSource('/api/live');
        eventSourceRef.current = es;

        es.onopen = () => setConnected(true);

        es.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'connected') {
                    setConnected(true);
                    return;
                }

                setEvents((prev) => {
                    const next = [data as LiveEvent, ...prev];
                    return next.slice(0, maxEvents);
                });
            } catch {
                // Ignore malformed events
            }
        };

        es.onerror = () => {
            setConnected(false);
            // Auto-reconnect is handled by EventSource natively
        };

        return () => {
            es.close();
            setConnected(false);
        };
    }, []);

    // ── Filter events ─────────────────────────────────────────────────────────
    const filteredEvents = filter === 'all'
        ? events
        : filter === 'critical'
            ? events.filter(e => e.severity === 'CRITICAL' || e.severity === 'HIGH')
            : events.filter(e => e.type === filter);

    return (
        <main className="min-h-screen bg-[#FAFAFA] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="relative z-10 pt-28 pb-20 px-6 max-w-5xl mx-auto">
                {/* Hero */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-400/10 border border-red-400/20 text-sm text-red-400 mb-3">
                            <Radio className="w-4 h-4 animate-pulse" /> Live Monitoring
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold">
                            Guardian{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-cyan-400">
                                Watcher
                            </span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm transition-colors">
                            Real-time BNB Chain event monitoring with AI-translated alerts.
                        </p>
                    </div>

                    {/* Connection status + Controls */}
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${connected ? 'bg-green-400/10 text-green-400 border border-green-400/20' : 'bg-red-400/10 text-red-400 border border-red-400/20'}`}>
                            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                            {connected ? 'Connected' : 'Disconnected'}
                        </div>
                        <button
                            onClick={() => setPaused(!paused)}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            title={paused ? 'Resume' : 'Pause'}
                        >
                            {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            title={soundEnabled ? 'Mute' : 'Unmute'}
                        >
                            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={() => setEvents([])}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            title="Clear feed"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: 'Total Events', value: stats.total, color: 'text-cyan-400', Icon: Activity },
                        { label: 'Critical', value: stats.critical, color: 'text-red-400', Icon: ShieldX },
                        { label: 'High', value: stats.high, color: 'text-orange-400', Icon: ShieldAlert },
                        { label: 'Guardian Actions', value: stats.guardianActions, color: 'text-green-400', Icon: Shield },
                    ].map(({ label, value, color, Icon }) => (
                        <div key={label} className="glass-card rounded-xl p-3 flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center transition-colors`}>
                                <Icon className={`w-4 h-4 ${color}`} />
                            </div>
                            <div>
                                <div className={`text-lg font-bold ${color}`}>{value}</div>
                                <div className="text-xs text-gray-500">{label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                    {[
                        { id: 'all', label: 'All Events' },
                        { id: 'critical', label: 'Critical & High' },
                        { id: 'whale_activity', label: 'Whale Activity' },
                        { id: 'dev_wallet', label: 'Dev Wallet' },
                        { id: 'lp_removal', label: 'LP Removal' },
                        { id: 'price_drop', label: 'Price Drop' },
                        { id: 'guardian_action', label: 'Guardian Actions' },
                    ].map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => setFilter(id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${filter === id
                                    ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 border border-transparent'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Event feed */}
                <div ref={feedRef} className="space-y-3">
                    {filteredEvents.length === 0 ? (
                        <div className="glass-card rounded-2xl p-10 text-center">
                            <div className="w-16 h-16 bg-cyan-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Radio className="w-8 h-8 text-cyan-400 animate-pulse" />
                            </div>
                            <h3 className="font-semibold mb-1">Listening for events…</h3>
                            <p className="text-sm text-gray-500">
                                The Guardian Watcher is monitoring BNB Chain. Events will appear here in real-time.
                            </p>
                        </div>
                    ) : (
                        filteredEvents.map((event) => {
                            const config = getSeverityConfig(event.severity);
                            const EventIcon = getEventIcon(event.type);

                            return (
                                <div
                                    key={event.id}
                                    className={`glass-card rounded-xl p-4 border-l-4 ${config.border} animate-fade-in`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Icon */}
                                        <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                                            <EventIcon className={`w-5 h-5 ${config.color}`} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <h4 className="text-sm font-semibold truncate">{event.title}</h4>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${config.bg} ${config.color}`}>
                                                        {event.severity}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 font-mono">
                                                        {formatTime(event.timestamp)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Token badge */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs text-gray-500 font-mono">{event.token.symbol}</span>
                                                {event.token.isGuardian && (
                                                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-400/10 text-green-400">
                                                        <Shield className="w-2.5 h-2.5" /> Guardian
                                                    </span>
                                                )}
                                                {event.value && (
                                                    <span className={`text-xs font-bold ${config.color}`}>{event.value}</span>
                                                )}
                                            </div>

                                            {/* AI Translation */}
                                            <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 transition-colors">
                                                <div className="flex items-center gap-1 mb-1">
                                                    <Zap className="w-3 h-3 text-gold" />
                                                    <span className="text-[10px] text-gold font-medium">AI Analysis</span>
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors leading-relaxed">
                                                    {event.aiTranslation}
                                                </p>
                                            </div>

                                            {/* Guardian Contract Action */}
                                            {event.contractAction && (
                                                <div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-400/5 border border-green-400/10 text-xs text-green-400">
                                                    <Shield className="w-3.5 h-3.5" />
                                                    <span className="font-medium">Auto-action:</span> {event.contractAction}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </main>
    );
}
