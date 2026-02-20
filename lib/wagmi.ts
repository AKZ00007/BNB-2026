
'use client'

import { http, createConfig } from 'wagmi'
import { bsc, bscTestnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
    chains: [bsc, bscTestnet],
    connectors: [
        injected(),
    ],
    transports: {
        [bsc.id]: http(),
        [bscTestnet.id]: http(),
    },
    ssr: true, // Enable SSR support to fix hydration issues
})
