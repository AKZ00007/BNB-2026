import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Web3Provider } from "@/components/providers/web3-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono",
    display: "swap",
});

export const metadata: Metadata = {
    title: "GROWUP AI | End Token Crashes",
    description: "Generate crash-proof tokenomics configurations from plain-English goals. AI-backed, data-driven, 1-click BSC deployment.",
    keywords: "token launchpad, BSC, BNB Chain, tokenomics, AI, DeFi, crypto",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth" suppressHydrationWarning>
            <head>

            </head>
            <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased selection:bg-red-100 selection:text-red-900`}>
                <NextTopLoader
                    color="#facc15"
                    initialPosition={0.08}
                    crawlSpeed={200}
                    height={3}
                    crawl={true}
                    showSpinner={false}
                    easing="ease"
                    speed={200}
                    shadow="0 0 10px #facc15,0 0 5px #facc15"
                />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Web3Provider>
                        <AuthProvider>
                            <Navbar />
                            <main className="min-h-screen pt-16">
                                {children}
                            </main>
                            <Footer />
                        </AuthProvider>
                    </Web3Provider>
                </ThemeProvider>
            </body>
        </html>
    );
}
