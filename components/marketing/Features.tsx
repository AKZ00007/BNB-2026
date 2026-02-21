'use client'
import * as Tabs from '@radix-ui/react-tabs'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { LineChart, Shield, Code2 } from 'lucide-react'

export function Features() {
    return (
        <section className="py-24 bg-[#0A0A0C] text-white">
            <div className="max-w-[1200px] mx-auto px-8">
                <div className="text-center mb-16">
                    <SectionLabel className="!text-[#F0B90B]">Dual-Layer Safety</SectionLabel>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                        Protecting your bags, <br /> on-chain and off-chain.
                    </h2>
                    <p className="text-lg text-gray-400 max-w-[600px] mx-auto">
                        Whether you are deploying a robust token through our unbreakable Control Layer, or verifying an unknown address via our AI Intelligence Layer — GuardianLaunch has your back.
                    </p>
                </div>

                <Tabs.Root defaultValue="tab1" className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">

                    <Tabs.List className="flex flex-row lg:flex-col shrink-0 gap-4 overflow-x-auto pb-4 lg:pb-0 w-full lg:w-[320px]">

                        <Tabs.Trigger
                            value="tab1"
                            className="text-left p-6 rounded-2xl border border-white/10 hover:bg-white/5 transition-all w-full min-w-[280px] group data-[state=active]:bg-white/10 data-[state=active]:border-white/20 data-[state=active]:shadow-[0_0_30px_rgba(240,185,11,0.1)] outline-none"
                        >
                            <LineChart className="w-6 h-6 text-[#F0B90B] mb-4" />
                            <h4 className="font-bold text-lg mb-2 group-data-[state=active]:text-white text-gray-300">Progressive Liquidity</h4>
                            <p className="text-sm text-gray-400">Our flagship PLU model ties liquidity unlocks to real-time project health scores, halting unlocks if scams are detected.</p>
                        </Tabs.Trigger>

                        <Tabs.Trigger
                            value="tab2"
                            className="text-left p-6 rounded-2xl border border-white/10 hover:bg-white/5 transition-all w-full min-w-[280px] group data-[state=active]:bg-white/10 data-[state=active]:border-white/20 data-[state=active]:shadow-[0_0_30px_rgba(240,185,11,0.1)] outline-none"
                        >
                            <Shield className="w-6 h-6 text-[#F0B90B] mb-4" />
                            <h4 className="font-bold text-lg mb-2 group-data-[state=active]:text-white text-gray-300">Live Warning Feed</h4>
                            <p className="text-sm text-gray-400">Connects directly to the BNB Chain to warn you of sudden dumps, LP removals, and whale movements in human-readable alerts.</p>
                        </Tabs.Trigger>

                        <Tabs.Trigger
                            value="tab3"
                            className="text-left p-6 rounded-2xl border border-white/10 hover:bg-white/5 transition-all w-full min-w-[280px] group data-[state=active]:bg-white/10 data-[state=active]:border-white/20 data-[state=active]:shadow-[0_0_30px_rgba(240,185,11,0.1)] outline-none"
                        >
                            <Code2 className="w-6 h-6 text-[#F0B90B] mb-4" />
                            <h4 className="font-bold text-lg mb-2 group-data-[state=active]:text-white text-gray-300">AI Risk Scanner</h4>
                            <p className="text-sm text-gray-400">Paste any BEP-20 address and get a full contract code, ownership, and liquidity safety analysis in under 5 seconds.</p>
                        </Tabs.Trigger>

                    </Tabs.List>

                    <div className="w-full bg-[#121218] rounded-3xl border border-white/10 aspect-video md:aspect-[4/3] relative overflow-hidden flex items-center justify-center p-8">
                        <Tabs.Content value="tab1" className="w-full h-full animate-fade-in outline-none">
                            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#1A1A22] to-[#0A0A0C] border border-white/5 shadow-2xl p-6 flex flex-col justify-end">
                                <div className="w-full h-2/3 bg-white/5 rounded-t-xl border-x border-t border-white/10 flex items-end px-4 gap-2 pb-0">
                                    <div className="w-1/6 h-[80%] bg-[#F0B90B] rounded-t-sm" />
                                    <div className="w-1/6 h-[60%] bg-[#00D6FF] rounded-t-sm" />
                                    <div className="w-1/6 h-[90%] bg-[#F0B90B] rounded-t-sm" />
                                    <div className="w-1/6 h-[40%] bg-[#00D6FF] rounded-t-sm" />
                                </div>
                            </div>
                        </Tabs.Content>

                        <Tabs.Content value="tab2" className="w-full h-full animate-fade-in outline-none flex items-center justify-center">
                            <div className="relative">
                                <Shield className="w-48 h-48 text-green-500/20" />
                                <Shield className="w-48 h-48 text-green-500 absolute inset-0 animate-pulse-glow" />
                            </div>
                        </Tabs.Content>

                        <Tabs.Content value="tab3" className="w-full h-full animate-fade-in outline-none">
                            <div className="w-full h-full rounded-xl bg-black border border-white/10 p-6 font-mono text-sm text-purple-400/80">
                                <div className="text-white mb-2">SCANNING: 0x71C...976F</div>
                                <div className="pl-4 text-green-400">✓ Mint function disabled</div>
                                <div className="pl-4 text-green-400">✓ Ownership renounced</div>
                                <div className="pl-4 text-red-400">⚠ Dev holds 12% supply</div>
                                <div className="pl-4 pt-4 text-purple-400">// AI Conclusion:</div>
                                <div className="pl-4 text-white">Score: 65/100 (CAUTION)</div>
                            </div>
                        </Tabs.Content>
                    </div>

                </Tabs.Root>
            </div>
        </section>
    )
}
