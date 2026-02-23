import Link from 'next/link'
import { Twitter, Instagram, Youtube } from 'lucide-react'

const links = {
    Product: ['Features', 'Pricing', 'Documentation', 'API'],
    Company: ['About Us', 'Careers', 'Blog', 'Press', 'Partners'],
    Resources: ['Community', 'Contact', 'Support', 'Status'],
}

const social = [
    { label: 'Twitter', icon: Twitter, href: '#' },
    { label: 'Instagram', icon: Instagram, href: '#' },
    { label: 'Youtube', icon: Youtube, href: '#' },
]

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 pt-16 pb-8 transition-colors duration-300">
            <div className="max-w-[1200px] mx-auto px-8">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-10 group">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0" y="0" width="12" height="12" rx="1" className="fill-gray-900 dark:fill-gray-100 group-hover:fill-primary dark:group-hover:fill-primary transition-colors" />
                        <rect x="14" y="2" width="9" height="9" rx="1" className="fill-gray-900 dark:fill-gray-100 group-hover:fill-primary dark:group-hover:fill-primary transition-colors delay-75" />
                        <rect x="2" y="14" width="9" height="9" rx="1" className="fill-gray-900 dark:fill-gray-100 group-hover:fill-primary dark:group-hover:fill-primary transition-colors delay-100" />
                        <rect x="14" y="14" width="7" height="7" rx="1" className="fill-gray-900 dark:fill-gray-100 group-hover:fill-primary dark:group-hover:fill-primary transition-colors delay-150" />
                    </svg>
                    <span className="font-bold text-base text-gray-900 dark:text-gray-100 transition-colors">GROWUP AI</span>
                </div>

                {/* Link columns */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {Object.entries(links).map(([heading, items]) => (
                        <div key={heading}>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors">{heading}</h4>
                            <ul className="flex flex-col gap-2.5">
                                {items.map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors">Social</h4>
                        <ul className="flex flex-col gap-2.5">
                            {social.map(({ label, icon: Icon, href }) => (
                                <li key={label}>
                                    <Link href={href} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                                        <Icon size={14} />
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
                    <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors">
                        Copyright © 2026 GROWUP AI — Build secure tokenomics with AI.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:underline transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:underline transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
