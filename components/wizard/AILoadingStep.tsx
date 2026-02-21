'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const MESSAGES = [
    'Analyzing your token vision…',
    'Studying 50+ successful BSC launches…',
    'Calculating optimal TGE percentage…',
    'Designing vesting schedule…',
    'Configuring AMM parameters…',
    'Setting up PLU milestones…',
    'Running rug-pull risk analysis…',
    'Finalizing tokenomics config…',
];

export function AILoadingStep() {
    const [msgIndex, setMsgIndex] = useState(0);
    const [dots, setDots] = useState('');

    useEffect(() => {
        const msgInterval = setInterval(() => {
            setMsgIndex((i) => (i + 1) % MESSAGES.length);
        }, 1800);

        const dotInterval = setInterval(() => {
            setDots((d) => (d.length >= 3 ? '' : d + '.'));
        }, 400);

        return () => {
            clearInterval(msgInterval);
            clearInterval(dotInterval);
        };
    }, []);

    return (
        <div className="max-w-lg mx-auto w-full text-center animate-fade-in">
            {/* Animated orb */}
            <div className="relative w-32 h-32 mx-auto mb-10">
                <div
                    className="absolute inset-0 rounded-full border-2 border-gold/20"
                    style={{ animation: 'spin 3s linear infinite' }}
                />
                <div
                    className="absolute inset-2 rounded-full border-2 border-purple/30"
                    style={{ animation: 'spin 2s linear infinite reverse' }}
                />
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gold/20 to-purple/20 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-gold animate-pulse" />
                </div>
            </div>

            <h2 className="text-3xl font-bold mb-4">
                AI is{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold to-purple-400">
                    thinking
                </span>
                {dots}
            </h2>

            <p className="text-gray-600 text-lg min-h-[1.75rem] transition-all duration-500">
                {MESSAGES[msgIndex]}
            </p>

            <div className="mt-10 flex justify-center gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="w-1.5 rounded-full bg-gold/60"
                        style={{
                            height: '24px',
                            animation: 'eqBar 1s ease-in-out infinite',
                            animationDelay: `${i * 0.15}s`,
                        }}
                    />
                ))}
            </div>

            {/* Keyframe injected via globals (uses standard CSS animation) */}
            <style>{`
        @keyframes eqBar {
          0%, 100% { transform: scaleY(0.3); opacity: 0.4; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
        </div>
    );
}
