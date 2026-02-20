'use client';

import { useState } from 'react';
import { Sparkles, Rocket, Zap, Users, Coins, Bot } from 'lucide-react';

const SUGGESTION_PILLS = [
    { icon: <Zap className="w-3 h-3" />, label: 'Meme token with anti-dump protection' },
    { icon: <Coins className="w-3 h-3" />, label: 'DeFi utility token for yield farming' },
    { icon: <Users className="w-3 h-3" />, label: 'DAO governance token for my community' },
    { icon: <Bot className="w-3 h-3" />, label: 'AI agent token with pay-per-query utility' },
    { icon: <Rocket className="w-3 h-3" />, label: 'Gaming reward token with deflationary burn' },
];

interface GoalInputStepProps {
    onSubmit: (goal: string) => void;
}

export function GoalInputStep({ onSubmit }: GoalInputStepProps) {
    const [goal, setGoal] = useState('');

    const handleSubmit = () => {
        if (goal.trim().length >= 10) onSubmit(goal.trim());
    };

    const handlePill = (text: string) => {
        setGoal(text);
    };

    return (
        <div className="max-w-2xl mx-auto w-full animate-fade-in">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium mb-6">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Token Wizard — Step 1 of 3</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Describe Your{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold to-purple-400">
                        Token Vision
                    </span>
                </h1>
                <p className="text-text-secondary text-lg">
                    Write your goals in plain English. Our AI will generate crash-proof tokenomics.
                </p>
            </div>

            {/* Text area */}
            <div className="glass-card-prominent rounded-2xl p-6 mb-6">
                <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g. I want to launch a community meme token for dog lovers on BSC with strong anti-whale mechanics, 3-month team vesting, and a 10% sell tax that goes to a charity wallet..."
                    className="w-full h-40 bg-transparent text-text-primary placeholder-text-tertiary text-base leading-relaxed resize-none outline-none"
                    maxLength={2000}
                />
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                    <span className="text-text-tertiary text-sm">
                        {goal.length}/2000 characters
                    </span>
                    <span className={`text-sm ${goal.length >= 10 ? 'text-success' : 'text-text-tertiary'}`}>
                        {goal.length >= 10 ? '✓ Ready' : `${Math.max(0, 10 - goal.length)} more characters needed`}
                    </span>
                </div>
            </div>

            {/* Suggestion pills */}
            <div className="mb-8">
                <p className="text-text-tertiary text-sm mb-3">Quick starts:</p>
                <div className="flex flex-wrap gap-2">
                    {SUGGESTION_PILLS.map((pill, i) => (
                        <button
                            key={i}
                            onClick={() => handlePill(pill.label)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-white/5 border border-white/10 text-text-secondary hover:border-gold/40 hover:text-gold hover:bg-gold/5 transition-all"
                        >
                            {pill.icon}
                            {pill.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <button
                onClick={handleSubmit}
                disabled={goal.trim().length < 10}
                className="w-full group relative flex items-center justify-center gap-3 px-8 py-5 text-lg font-semibold text-bg-base rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:scale-[1.02] enabled:animate-pulse-glow"
                style={{ background: 'linear-gradient(135deg, #F0B90B 0%, #8B5CF6 100%)' }}
            >
                <Sparkles className="w-5 h-5" />
                Generate Tokenomics with AI
                <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}
