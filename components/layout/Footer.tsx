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
                    <div className="w-6 h-6 grid grid-cols-2 gap-0.5">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className={`bg-gray-900 dark:bg-gray-100 rounded-sm transition-colors duration-300 group-hover:bg-primary dark:group-hover:bg-primary`} style={{ transitionDelay: `${i * 50}ms` }} />
                        ))}
                    </div>
                    <span className="font-bold text-base text-gray-900 dark:text-gray-100 transition-colors">BNB Launchpad</span>
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
                        Copyright © 2026 BNB Launchpad — Build secure tokenomics with AI.
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
