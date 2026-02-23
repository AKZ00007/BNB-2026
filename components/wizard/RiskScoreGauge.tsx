export function RiskScoreGauge({ score }: { score: number }) {
    // 0-10 scale
    const percentage = (score / 10) * 100;
    const isLowRisk = score >= 7;
    const isMedRisk = score >= 4 && score < 7;

    // SVG math for circular progress
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const colorClass = isLowRisk ? 'text-[#10B981]' : isMedRisk ? 'text-[#F59E0B]' : 'text-[#EF4444]';
    const label = isLowRisk ? 'Low Risk' : isMedRisk ? 'Medium Risk' : 'High Risk';

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-16 h-16 flex items-center justify-center mb-1">
                {/* Background Ring */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-slate-200 dark:text-[#1F2937] transition-colors"
                    />
                    {/* Progress Ring */}
                    <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className={`${colorClass} transition-all duration-1000 ease-out`}
                    />
                </svg>
                {/* Central Score Text */}
                <span className={`text-xl font-bold ${colorClass}`}>{score}</span>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${colorClass}`}>
                {label}
            </span>
        </div>
    );
}
