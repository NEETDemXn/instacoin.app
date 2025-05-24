"use client";

import { useWallet } from "@solana/wallet-adapter-react";

import CreateTokenForm from "@/Components/CreateTokenForm";
import WalletButton from "@/Components/WalletButton";

import { IoWallet } from "react-icons/io5";

export default function Form({ page, setPage, openConnectModal }: {
    page: 0 | 1 | 2 | 3,
    setPage: (page: 0 | 1 | 2 | 3) => void
    openConnectModal: () => void
}) {
    const { publicKey } = useWallet();

    return (
        <div className="mx-auto my-4 w-4/5 md:w-2/3 lg:w-[800px] border-3 border-black bg-blue flex flex-col rounded-xl shadow-pop">
            {
                publicKey === null ?
                    <div className="flex flex-col w-full text-center">
                        <div className="mx-auto">
                            <IoWallet size={80} />
                        </div>
                        <span className="text-2xl font-black">CONNECT YOUR WALLET</span>
                        <span className="font-[family-name:Tektur]">Connect your wallet to continue...</span>
                        <div className="mx-auto">
                            <WalletButton openConnectModal={openConnectModal} />
                        </div>
                    </div>
                    :
                    <CreateTokenForm page={page} setPage={setPage} />
            }
        </div>
    );
};