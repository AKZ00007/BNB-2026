interface MarqueeProps {
    items: React.ReactNode[]
    direction?: 'left' | 'right'
    duration?: number
    gap?: number
    pauseOnHover?: boolean
}

export function Marquee({
    items,
    direction = 'left',
    duration = 30,
    gap = 48,
    pauseOnHover = true,
}: MarqueeProps) {
    const animClass = direction === 'left' ? 'animate-marquee' : 'animate-marquee-rev'
    const hoverClass = pauseOnHover ? '[&:hover>*]:![animation-play-state:paused]' : ''

    return (
        <div
            className={`overflow-hidden ${hoverClass}`}
            style={{
                maskImage:
                    'linear-gradient(to right, transparent, white 8%, white 92%, transparent)',
            }}
        >
            <div
                className={`flex w-max ${animClass}`}
                style={{ gap: `${gap}px`, animationDuration: `${duration}s` }}
            >
                {/* Duplicate for seamless loop */}
                {[...items, ...items].map((item, i) => (
                    <div key={i} className="flex-shrink-0 flex items-center">
                        {item}
                    </div>
                ))}
            </div>
        </div>
    )
}
