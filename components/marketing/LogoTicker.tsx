import { Marquee } from "@/components/ui/marquee"
import { Github, Twitter, Youtube, Twitch, Figma, Chrome, Gitlab, Slack } from "lucide-react"

const logos = [
    { name: "Github", icon: Github },
    { name: "Twitter", icon: Twitter },
    { name: "YouTube", icon: Youtube },
    { name: "Twitch", icon: Twitch },
    { name: "Figma", icon: Figma },
    { name: "Google", icon: Chrome }, // Fallback icon
    { name: "Gitlab", icon: Gitlab },
    { name: "Slack", icon: Slack },
]

export function LogoTicker() {
    return (
        <section className="bg-[#FAFAFA] border-b border-[#E5E7EB] py-16 overflow-hidden">
            <div className="max-w-[1200px] mx-auto">
                <p className="text-center text-sm font-semibold text-[#6B7280] uppercase tracking-widest mb-10">
                    Trusted by developers worldwide
                </p>
                <div className="relative flex w-full flex-col items-center justify-center">
                    <Marquee pauseOnHover className="[--duration:30s]">
                        {logos.map((logo) => (
                            <div key={logo.name} className="flex items-center gap-2 mx-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                                <logo.icon className="w-8 h-8 text-[#111827]" />
                                <span className="font-bold text-xl text-[#111827]">{logo.name}</span>
                            </div>
                        ))}
                    </Marquee>
                    {/* Shadow masking gradients */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#FAFAFA] to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#FAFAFA] to-transparent" />
                </div>
            </div>
        </section>
    )
}
