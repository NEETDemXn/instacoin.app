"use client";

import { ReactNode, useMemo } from "react";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";

export default function Provider({ children }: { children: ReactNode }) {
    const endpoint = clusterApiUrl("mainnet-beta");
    const wallets = useMemo(() => [
        new SolflareWalletAdapter()
    ], []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                {children}
            </WalletProvider>
        </ConnectionProvider>
    );
}