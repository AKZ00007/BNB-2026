import { cn } from '@/lib/utils'
import { LayoutGrid } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost'
    showIcon?: boolean
    size?: 'sm' | 'md' | 'lg'
    asChild?: boolean
}

const sizeMap = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
}

const variantMap = {
    primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-cta',
    outline: 'border border-gray-200 text-gray-900 bg-white hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
}

export function Button({
    children,
    variant = 'primary',
    showIcon = false,
    size = 'md',
    className,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center gap-2 font-semibold rounded-full',
                'transition-all duration-200 active:scale-[0.98] hover:scale-[1.02]',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                sizeMap[size],
                variantMap[variant],
                className
            )}
            {...props}
        >
            {showIcon && variant === 'primary' && (
                <LayoutGrid size={16} className="shrink-0" />
            )}
            {children}
        </button>
    )
}
