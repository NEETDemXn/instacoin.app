"use client";

import {useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export default function WalletButton({ openConnectModal }: {
    openConnectModal: () => void
}) {
    const { publicKey, wallet, connecting } = useWallet();
    const [innerText, setInnerText] = useState<string>("");

    useEffect(() => {
        if (publicKey !== null) {
            const walletAddress = publicKey.toString();
            let firstFourDigits = "";
            let lastFourDigits = "";

            for (let i = 0; i < 4; i++) {
                firstFourDigits += walletAddress[i];
            }

            for (let i = walletAddress.length - 1 - 4; i < walletAddress.length; i++) {
                lastFourDigits += walletAddress[i];
            }

            const displayText = `${firstFourDigits}...${lastFourDigits}`;

            setInnerText(displayText);
        } else {
            setInnerText("Connect Wallet");
        }
    }, [publicKey]);

    return (
        <div className={`flex flex-row bg-purple p-3 border-3 m-2 rounded-xl group hover:cursor-pointer hover:bg-pink active:shadow-pop active:bg-pink`} onClick={openConnectModal}>
            {
                wallet && (
                    <img src={wallet.adapter.icon} alt="" className="w-8 mx-2" />
                )
            }
            <span className="m-auto text-white font-bold group-hover:underline group-active:underline decoration-2">
                {
                    connecting ?
                        "CONNECTING..."
                        :
                        innerText
                }
            </span>
        </div>
    );
}