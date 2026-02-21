'use client'
import * as Accordion from '@radix-ui/react-accordion'
import { Plus } from 'lucide-react'

const faqs = [
    { q: 'Do I need to know how to code?', a: 'Not at all. You can launch our pre-audited Guardian Tokens with 1 click directly from the UI.' },
    { q: 'Are Guardian Tokens safe?', a: 'Yes. Every contract starts from an OpenZeppelin foundation and includes hardcoded rules to prevent honeypots, hidden mints, and snipers.' },
    { q: 'What wallets are supported?', a: 'We use RainbowKit, which supports MetaMask, Trust Wallet, WalletConnect, Coinbase Wallet, and dozens more.' },
    { q: 'Can I test the platform?', a: 'Absolutely. You can run unlimited Free deployments on the BSC Testnet. The AI Risk Scanner is also completely free.' },
    { q: 'How does Progressive Liquidity Unlock (PLU) work?', a: 'Instead of locking LP for arbitrarily long periods, PLU dynamically unlocks liquidity based on a real-time health score of your token. Healthy tokens unlock smoothly, while scams get frozen immediately.' }
]

export function FAQ() {
    return (
        <section className="py-24 bg-white dark:bg-gray-950 transition-colors duration-300">
            <div className="max-w-[720px] mx-auto px-8">
                <h2 className="text-4xl font-extrabold text-[#111827] dark:text-gray-100 mb-12 text-center tracking-tight transition-colors">
                    Frequently asked questions
                </h2>

                <Accordion.Root type="multiple" className="flex flex-col gap-4">
                    {faqs.map((faq, i) => (
                        <Accordion.Item
                            key={i}
                            value={`item-${i}`}
                            className="border-b border-[#E5E7EB] dark:border-gray-800 overflow-hidden transition-colors"
                        >
                            <Accordion.Header>
                                <Accordion.Trigger className="w-full text-left py-6 flex items-center justify-between group outline-none">
                                    <span className="font-bold text-lg text-[#111827] dark:text-gray-100 group-hover:text-primary transition-colors">
                                        {faq.q}
                                    </span>
                                    <Plus className="w-5 h-5 text-[#9CA3AF] group-data-[state=open]:rotate-45 group-data-[state=open]:text-primary transition-transform duration-300 outline-none" />
                                </Accordion.Trigger>
                            </Accordion.Header>
                            <Accordion.Content className="pb-6 text-[#6B7280] dark:text-gray-400 leading-relaxed data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden transition-colors">
                                {faq.a}
                            </Accordion.Content>
                        </Accordion.Item>
                    ))}
                </Accordion.Root>
            </div>
        </section>
    )
}
