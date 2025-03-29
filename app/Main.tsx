"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

// Icons
import { IoIosClose } from "react-icons/io";

// Types
// import Image from "next/image";

function ConnectWallet({ closeConnectModal }: {
    closeConnectModal: () => void
}) {
    const { wallets, select } = useWallet();

    return (
        <div className="flex flex-col font-[family-name:Tektur] m-auto bg-white border-5 rounded-xl mt-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-row w-full justify-end h-4 my-2">
                <IoIosClose className="hover:cursor-pointer hover:text-red active:text-red border-2 mr-2 rounded-md" size={40} onClick={closeConnectModal} />
            </div>

            <span className="mx-auto mt-8 font-bold md:text-xl">
                {"// Select Your Wallet Provider"}
            </span>

            <span className="text-sm mx-2 text-center">
                {"If you're using MetaMask and don't see it on the list, try refreshing your browser."}
            </span>

            <div className="flex flex-col justify-between">
                {
                    wallets.map((wallet, i) => (
                        <div
                            key={i}
                            className="flex flex-col rounded-xl border-4 border-black w-2/3 mx-auto text-center p-1 my-2 hover:cursor-pointer hover:bg-pink hover:underline hover:text-white active:bg-pink active:underline active:text-white"
                            onClick={() => {
                                select(wallet.adapter.name);
                                closeConnectModal();
                            }}
                        >
                            <img src={wallet.adapter.icon} alt="" className="w-12 mx-auto" />
                            <span>{wallet.adapter.name}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

function DisconnectWallet({ disconnectWallet, closeConnectModal }: {
    disconnectWallet: () => void,
    closeConnectModal: () => void
}) {

    return (
        <div className="flex flex-col m-auto bg-red border-5 rounded-xl mt-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-row w-full justify-end h-4 my-2">
                <IoIosClose className="hover:cursor-pointer hover:text-white active:text-white border-2 mr-2 rounded-md" size={40} onClick={closeConnectModal} />
            </div>

            <span className="m-8 font-bold font-[family-name:Tektur] md:text-xl">
                {"// Disconnect Wallet?"}
            </span>

            <div className="mx-auto m-4 p-4 bg-white border-5 border-black rounded-xl hover:cursor-pointer hover:bg-pink hover:underline active:bg-pink active:underline" onClick={disconnectWallet}>
                <span className="text-xl font-[family-name:Tektur]">DISCONNECT</span>
            </div>
        </div>
    );
}

function WalletModal({ closeConnectModal, disconnectWallet }: {
    closeConnectModal: () => void,
    disconnectWallet: () => void
}) {
    const { publicKey } = useWallet();

    return (
        <div className="absolute flex m-auto top-0 left-0 flex z-10 h-screen w-full bg-black/50 overflow-hidden" onClick={closeConnectModal}>

            <div className="relative h-full w-full">
                <div className="absolute flex w-full top-0 left-0">
                    {
                        publicKey === null ?
                            <ConnectWallet closeConnectModal={closeConnectModal} />
                            :
                            <DisconnectWallet disconnectWallet={disconnectWallet} closeConnectModal={closeConnectModal} />
                    }
                </div>
            </div>

        </div>
    );
}

function WalletButton({ openConnectModal }: {
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
        <div className="flex flex-row bg-purple p-3 border-3 m-2 rounded-xl group hover:cursor-pointer hover:bg-pink active:bg-pink" onClick={openConnectModal}>
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

export default function Home() {
    const { publicKey, disconnect } = useWallet();
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const openConnectModal = () => setModalVisible(true);
    const closeConnectModal = () => setModalVisible(false);

    async function handleDisconnectWallet() {
        disconnect();
        closeConnectModal();
    }

    return (
        <div className="flex flex-col relative">
            {
                modalVisible && (
                    <WalletModal
                        closeConnectModal={closeConnectModal}
                        disconnectWallet={handleDisconnectWallet}
                    />
                )
            }

            <div className="w-full flex flex-row justify-end">
                <WalletButton openConnectModal={openConnectModal} />
            </div>

            <div className="w-full flex flex-col mt-5">
                <div className="mx-auto text-center w-full md:w-3/4">
                    <span className="font-black text-4xl md:text-[72px]">
                        CREATE YOUR OWN COIN ON THE SOLANA NETWORK, NO CODING NECESSARY!
                    </span>
                </div>

                <div className="mx-auto text-center">
                    <span className="font-[family-name:Tektur]">
                        Launch your token quickly, securely, and easily! Check us out on <span className="underline hover:cursor-pointer hover:text-pink hover:font-bold active:text-pink hover:font-bold">GitHub</span>! {"We're open source!"}
                    </span>
                </div>
            </div>
        </div>
    );
}