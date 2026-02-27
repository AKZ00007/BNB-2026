'use client';

import { useEffect, useState } from 'react';
import { Waves, Bot, TrendingDown, Shield } from 'lucide-react';

type EventType = 'whale' | 'bot' | 'dump';

interface LiveEvent {
    id: number;
    type: EventType;
    message: string;
    action: string;
    timestamp: Date;
}

const EVENT_TEMPLATES = [
    {
        type: 'whale' as const,
        message: 'Whale alert: 0x...8a3 attempted to acquire 2.5% of supply',
        action: 'Blocked (Exceeds 1% max wallet)',
    },
    {
        type: 'bot' as const,
        message: 'Bot detected: MEV snipe attempt from 0x...f21',
        action: 'Blocked (Anti-bot cooldown active)',
    },
    {
        type: 'dump' as const,
        message: 'Dump attempt: 0x...c44 selling 5% of supply',
        action: 'Penalized (10% dynamic sell tax applied)',
    },
    {
        type: 'whale' as const,
        message: 'Suspicious accumulated buying: 0x...99b',
        action: 'Blocked (Exceeds max wallet)',
    },
];

const ICONS = {
    whale: <Waves className="w-4 h-4 text-blue-400" />,
    bot: <Bot className="w-4 h-4 text-purple-400" />,
    dump: <TrendingDown className="w-4 h-4 text-orange-400" />,
};

export function LiveEventFeed() {
    const [events, setEvents] = useState<LiveEvent[]>([]);

    useEffect(() => {
        // Initial events
        setEvents(Array.from({ length: 3 }).map((_, i) => ({
            id: Date.now() - i * 10000,
            timestamp: new Date(Date.now() - i * 10000),
            ...EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)],
        })));

        // Add new events randomly every 3-8 seconds
        const interval = setInterval(() => {
            setEvents(prev => {
                const newEvent = {
                    id: Date.now(),
                    timestamp: new Date(),
                    ...EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)],
                };
                return [newEvent, ...prev].slice(0, 5); // Keep last 5
            });
        }, Math.random() * 5000 + 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-8 mb-4">
            <div className="flex items-center gap-2 mb-3 px-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Live Defense Feed</h3>
            </div>

            <div className="glass-card rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden relative min-h-[200px]">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#FAFAFA] dark:to-gray-950 z-10" />

                <div className="p-4 space-y-3 relative z-0">
                    {events.map((ev, i) => (
                        <div
                            key={ev.id}
                            className="flex items-start gap-4 p-3 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 animate-slide-in shadow-sm"
                            style={{ opacity: 1 - i * 0.2 }}
                        >
                            <div className="mt-0.5 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                {ICONS[ev.type]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {ev.message}
                                    </span>
                                    <span className="text-xs text-gray-400 font-mono ml-4 shrink-0">
                                        {ev.timestamp.toLocaleTimeString([], { hour12: false, second: '2-digit' })}
                                    </span>
                                </div>
                                <div className="text-xs font-semibold flex items-center gap-1.5 text-green-500">
                                    <Shield className="w-3 h-3" /> {ev.action}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
