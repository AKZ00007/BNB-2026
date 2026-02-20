
'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Loader2, Wallet } from 'lucide-react'
import { injected } from 'wagmi/connectors'

export function ConnectWallet() {
    const { address, isConnected } = useAccount()
    const { connect, isPending } = useConnect()
    const { disconnect } = useDisconnect()

    if (isConnected) {
        return (
            <Button
                variant="outline"
                onClick={() => disconnect()}
                className="glass-card hover:bg-white/10 border-white/10 text-text-primary gap-2"
            >
                <Wallet className="w-4 h-4 text-gold" />
                {address?.slice(0, 6)}...{address?.slice(-4)}
            </Button>
        )
    }

    return (
        <Button
            onClick={() => connect({ connector: injected() })}
            disabled={isPending}
            className="bg-gold hover:bg-gold/90 text-bg-base font-semibold gap-2 transition-all"
        >
            {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Wallet className="w-4 h-4" />
            )}
            Connect Wallet
        </Button>
    )
}
