import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Web3Provider } from "@/components/providers/web3-provider";
import { Header } from "@/components/layout/header";
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
    title: "AI Token Launchpad Designer | End Token Crashes",
    description: "Generate crash-proof tokenomics configurations from plain-English goals. AI-backed, data-driven, 1-click BSC deployment.",
    keywords: "token launchpad, BSC, BNB Chain, tokenomics, AI, DeFi, crypto",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
            <head>

            </head>
            <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased selection:bg-cyan/30 selection:text-white`}>
                <Web3Provider>
                    <Header />
                    {children}
                </Web3Provider>
            </body>
        </html>
    );
}
