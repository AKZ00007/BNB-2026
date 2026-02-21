import { cn } from '@/lib/utils'

export function SectionLabel({ children, className }: { children: string; className?: string }) {
    return (
        <p className={cn(
            'text-xs font-bold uppercase tracking-[0.1em] text-primary text-center mb-3',
            className
        )}>
            {children}
        </p>
    )
}
