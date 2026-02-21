'use client'
import { motion } from 'framer-motion'

interface BlurTextProps {
    text: string
    className?: string
}

export function BlurText({ text, className }: BlurTextProps) {
    const words = text.split(' ')
    return (
        <h1 className={className}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    className="inline-block mr-[0.25em]"
                    initial={{ opacity: 0, filter: 'blur(12px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.08 }}
                >
                    {word}
                </motion.span>
            ))}
        </h1>
    )
}
