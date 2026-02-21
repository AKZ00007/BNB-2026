'use client'
import * as Accordion from '@radix-ui/react-accordion'
import { Plus } from 'lucide-react'

const faqs = [
    { q: 'Do I need to know how to code?', a: 'Not at all. Our AI generates the Solidity code, tests it, and our interface deploys it directly to the BNB Smart Chain via your connected wallet.' },
    { q: 'Is the generated smart contract safe?', a: 'Yes. Every contract starts from an OpenZeppelin foundation (the industry standard for secure smart contracts) and is injected with our battle-tested modular upgrades for taxes and vesting.' },
    { q: 'What wallets are supported?', a: 'We use RainbowKit, which supports MetaMask, Trust Wallet, WalletConnect, Coinbase Wallet, and dozens more.' },
    { q: 'Can I simulate the launch before paying?', a: 'Absolutely. You can run unlimited Free simulations on the BSC Testnet. You only pay when deploying to Mainnet.' },
    { q: 'How does the Anti-Sniper bot protection work?', a: 'We implement an exponential block-delay tax. Anyone buying in Block 1 gets taxed 99% (which auto-burns or goes to LP), Block 2 gets taxed 50%, and by Block 4 taxes normalize to your set baseline. This destroys bot profitability.' }
]

export function FAQ() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-[720px] mx-auto px-8">
                <h2 className="text-4xl font-extrabold text-[#111827] mb-12 text-center tracking-tight">
                    Frequently asked questions
                </h2>

                <Accordion.Root type="multiple" className="flex flex-col gap-4">
                    {faqs.map((faq, i) => (
                        <Accordion.Item
                            key={i}
                            value={`item-${i}`}
                            className="border-b border-[#E5E7EB] overflow-hidden"
                        >
                            <Accordion.Header>
                                <Accordion.Trigger className="w-full text-left py-6 flex items-center justify-between group outline-none">
                                    <span className="font-bold text-lg text-[#111827] group-hover:text-primary transition-colors">
                                        {faq.q}
                                    </span>
                                    <Plus className="w-5 h-5 text-[#9CA3AF] group-data-[state=open]:rotate-45 group-data-[state=open]:text-primary transition-transform duration-300 outline-none" />
                                </Accordion.Trigger>
                            </Accordion.Header>
                            <Accordion.Content className="pb-6 text-[#6B7280] leading-relaxed data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                                {faq.a}
                            </Accordion.Content>
                        </Accordion.Item>
                    ))}
                </Accordion.Root>
            </div>
        </section>
    )
}
