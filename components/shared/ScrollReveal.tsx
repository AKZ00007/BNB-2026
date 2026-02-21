'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface ScrollRevealProps {
    children: React.ReactNode
    delay?: number
    className?: string
}

export function ScrollReveal({ children, delay = 0, className }: ScrollRevealProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: 'easeOut', delay }}
        >
            {children}
        </motion.div>
    )
}
