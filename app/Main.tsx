"use client";
import { useState, useEffect } from "react";

// Icons
import { IoIosClose } from "react-icons/io";

// Types
import Image from "next/image";

// Images
import Phantom from "@/public/phantom_icon.svg";
import MetaMask from "@/public/metamask_icon.svg";
import Coinbase from "@/public/coinbase_icon.svg";

declare global {
    interface Window {
        solana?: any
    }
};

function NotConnected({ setWalletAddress, closeConnectModal }: {
    setWalletAddress: (addr: string) => void,
    closeConnectModal: () => void
}) {
    const [hasPhantom, setHasPhantom] = useState<boolean>(false);

    async function checkWalletConnect() {
        if (typeof window !== "undefined" && window.solana?.isPhantom) {
            setHasPhantom(true);
        } else {
            setHasPhantom(false);
        }
    }

    async function connectPhantom() {
        try {
            const response = await window.solana.connect();
            localStorage.setItem("walletAddress", response.publicKey.toString());
            setWalletAddress(response.publicKey.toString());
            closeConnectModal();
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        checkWalletConnect();
    }, []);
    return (
        <div className="flex flex-col m-auto bg-white border-5 rounded-xl mt-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-row w-full justify-end h-4 my-2">
                <IoIosClose className="hover:cursor-pointer hover:text-red active:text-red border-2 mr-2 rounded-md" size={40} onClick={closeConnectModal} />
            </div>

            <span className="m-8 font-bold font-[family-name:Tektur] md:text-xl">
                {"// Select Your Wallet Provider"}
            </span>

            <div className="flex flex-col justify-between">
                <div className="flex flex-col rounded-xl border-4 border-black w-2/3 mx-auto text-center p-1 my-2 hover:cursor-pointer hover:bg-pink hover:underline hover:text-white active:bg-pink active:underline active:text-white" onClick={connectPhantom}>
                    <Image src={Phantom} alt="" className="w-12 mx-auto" />
                    <span className="font-[family-name:Tektur]">Phantom</span>
                    {
                        hasPhantom && (
                            <span className="font-[family-name:Tektur] text-xs">{"(detected)"}</span>
                        )
                    }
                </div>

                <div className="flex flex-col rounded-xl border-4 border-black w-2/3 mx-auto text-center p-1 my-2 hover:cursor-pointer hover:bg-pink hover:underline hover:text-white active:bg-pink active:underline active:text-white">
                    <Image src={MetaMask} alt="" className="w-12 mx-auto" />
                    <span className="font-[family-name:Tektur]">MetaMask</span>
                </div>

                <div className="flex flex-col rounded-xl border-4 border-black w-2/3 mx-auto text-center p-1 my-2 hover:cursor-pointer hover:bg-pink hover:underline hover:text-white active:bg-pink active:underline active:text-white">
                    <Image src={Coinbase} alt="" className="w-12 mx-auto" />
                    <span className="font-[family-name:Tektur]">Coinbase</span>
                </div>
            </div>
        </div>
    );
}

function Connected({ disconnectWallet, closeConnectModal }: {
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

function ConnectWalletModal({ walletAddress, setWalletAddress, closeConnectModal, disconnectWallet }: {
    walletAddress?: string,
    setWalletAddress: (addr: string) => void,
    closeConnectModal: () => void,
    disconnectWallet: () => void
}) {

    return (
        <div className="absolute flex m-auto top-0 left-0 flex z-10 h-screen w-full bg-black/50 overflow-hidden" onClick={closeConnectModal}>

            <div className="relative h-full w-full">
                <div className="absolute flex w-full top-0 left-0">
                    {
                        !walletAddress ?
                            <NotConnected setWalletAddress={setWalletAddress} closeConnectModal={closeConnectModal} />
                            :
                            <Connected disconnectWallet={disconnectWallet} closeConnectModal={closeConnectModal} />
                    }
                </div>
            </div>

        </div>
    );
}

function WalletButton({ walletAddress, openConnectModal }: {
    walletAddress?: string,
    openConnectModal: () => void
}) {
    const [innerText, setInnerText] = useState<string>("");

    useEffect(() => {
        if (walletAddress) {
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
    }, [walletAddress]);

    return (
        <div className="bg-purple p-3 border-3 m-2 rounded-xl group hover:cursor-pointer hover:bg-pink active:bg-pink" onClick={openConnectModal}>
            <span className="text-white font-bold group-hover:underline group-active:underline decoration-2">{innerText}</span>
        </div>
    );
}

export default function Home() {
    const [connectWallet, setConnectWallet] = useState<boolean>(false);
    const [walletAddress, setWalletAddress] = useState<string | undefined>(undefined);

    const openConnectModal = () => setConnectWallet(true);
    const closeConnectModal = () => setConnectWallet(false);

    async function handleDisconnectWallet() {
        setWalletAddress(undefined);
        closeConnectModal();
        localStorage.removeItem("walletAddress");
        await window.solana?.disconnect();
    }

    async function handleAutomaticWalletConnection() {
        if (localStorage.getItem("walletAddress")) {
            if (typeof window !== "undefined" && window.solana?.isPhantom) {
                try {
                    const res = await window.solana.connect({ onlyIfTrusted: true });
                    setWalletAddress(res.publicKey.toString());
                } catch {
                    setWalletAddress(undefined);
                }
            }
        }
    }

    useEffect(() => {
        handleAutomaticWalletConnection();
    }, []);

    return (
        <div className="flex flex-col relative">
            {
                connectWallet && (
                    <ConnectWalletModal
                        walletAddress={walletAddress}
                        closeConnectModal={closeConnectModal}
                        setWalletAddress={setWalletAddress}
                        disconnectWallet={handleDisconnectWallet}
                    />
                )
            }

            <div className="w-full flex flex-row justify-end">
                <WalletButton walletAddress={walletAddress} openConnectModal={openConnectModal} />
            </div>

            <div className="w-full flex flex-col mt-5">
                <div className="mx-auto text-center w-full md:w-3/4">
                    <span className="font-black text-4xl md:text-[72px]">
                        CREATE YOUR OWN COIN ON THE SOLANA NETWORK, NO CODING NECESSARY!
                    </span>
                </div>

                <div className="mx-auto text-center">
                    <span className="font-[family-name:Tektur]">
                        Launch your token quickly, securely, and easily! Check us out on <span className="underline hover:cursor-pointer hover:text-pink hover:font-bold active:text-pink hover:font-bold">GitHub</span>! We're open source!
                    </span>
                </div>
            </div>
        </div>
    );
}