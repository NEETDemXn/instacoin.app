"use client";

import { ReactNode } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export default function RenderComponent({ children }: {
    children: ReactNode
}) {
    const { connected, connecting, wallets } = useWallet();
    const isWalletReady = wallets.length > 0 || connected || connecting;

    return (
        <>
            {
                isWalletReady && (
                    children
                )
            }
        </>
    );
}