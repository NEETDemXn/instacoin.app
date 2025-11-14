"use client";

import { useState, useRef, useEffect, DragEvent } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import Image from "next/image";
import Link from "next/link";

// Types
import type { ChangeEvent } from "react";
import type { TokenForm } from "@/lib/types/TokenForm";
import type { IconType } from "react-icons";

// Icons
import { RiHandCoinLine } from "react-icons/ri";
import { TiUploadOutline } from "react-icons/ti";
import { FaRegHandPointRight } from "react-icons/fa6";
import { BsDatabaseFill } from "react-icons/bs";
import { FaAngleLeft } from "react-icons/fa6";
import { IoShareSocialSharp } from "react-icons/io5";
import { FaTwitter, FaTelegram, FaDiscord, FaGlobe, FaFileSignature, FaLock, FaPencilAlt } from "react-icons/fa";
import { GiCoinsPile, GiIceCube } from "react-icons/gi";
import { IoSparklesSharp } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { TbFidgetSpinner } from "react-icons/tb";
import { TbFaceIdError } from "react-icons/tb";
import { FaCopy } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdOutlineAddCircle } from "react-icons/md";

const initTokenForm: TokenForm = {
    name: "",
    symbol: "",
    file: null,
    decimals: 9,
    supply: 1000000000,
    description: "",
    twitter: "",
    telegram: "",
    discord: "",
    website: "",
    creator: "Instacoin.app",
    modifyCreatorData: true,
    revokeFreeze: true,
    revokeMint: true,
    revokeUpdate: true
};

function NextButton({ disabled, clickNextPage }: {
    disabled: boolean,
    clickNextPage: () => void
}) {
    function handleClick() {
        if (!disabled) clickNextPage();
    }

    return (
        <div
            onClick={handleClick}
            className={`absolute ${disabled ? "opacity-25 cursor-not-allowed" : "opacity-100 hover:cursor-pointer hover:bg-pink hover:underline active:bg-pink active:underline shadow-pop-small active:shadow-none active:top-2"} top-0 right-0 py-3 w-40 flex border-3 border-black bg-white rounded-xl decoration-2 `}
        >
            <div className="flex flex-row mx-auto">
                <span className="font-bold text-lg mx-2">Next</span>
                <div className={`${disabled ? "" : "animate-shake-custom"} flex`}>
                    <FaRegHandPointRight className="my-auto" size={20} />
                </div>
            </div>
        </div>
    );
}

function PrevButton({ clickPrevPage }: {
    clickPrevPage: () => void
}) {
    return (
        <div className="group flex flex-row transition-all w-12 hover:w-24 py-2 m-2 border-3 border-black rounded-lg hover:cursor-pointer hover:text-white hover:border-white active:text-white active:border-white" onClick={clickPrevPage}>
            <div className="mx-2">
                <FaAngleLeft className="animate-shake-custom m-auto" size={25} />
            </div>
            <span className="hidden group-hover:flex mx-auto">Back</span>
        </div>
    )
}

function Switch({ active, onClick }: {
    active: boolean,
    onClick: () => void
}) {
    return (
        <div className={`flex transition-color duration-300 ease-in-out w-12 h-6 outline-3 outline-solid rounded-full hover:cursor-pointer ${active ? "bg-pink" : "bg-white"}`} onClick={onClick}>
            <div className={`transition-transform duration-300 ease-in-out bg-white h-6 w-6 border-3 border-black rounded-full ${active ? "translate-x-6" : "translate-x-0"}`}>
            </div>
        </div>
    );
}

function NoPictureComponent() {
    return (
        <>
            <span>Drag & Drop Or Click/Tap Here</span>
            <div className="mx-auto">
                <TiUploadOutline size={80} />
            </div>
            <span className="font-bold font-[family-name:Tektur]">Upload Token Icon</span>
            <span className="text-sm">PNG, JPG, GIF up to 5MB</span>
        </>
    )
}

function PictureComponent({ picture, setTempIconUrl }: {
    picture: File,
    setTempIconUrl: (url: string) => void
}) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (picture) {
            const url = URL.createObjectURL(picture);
            setPreviewUrl(url);
            setTempIconUrl(url);
        }
    }, [picture, setTempIconUrl]);

    return (
        <>
            {
                previewUrl && (
                    <div className="flex flex-col">
                        <span className="font-[family-name:Tektur] font-semibold my-1">Preview:</span>
                        <Image
                            src={previewUrl}
                            alt=""
                            width={25}
                            height={25}
                            objectFit="cover"
                            className="mx-auto my-4 h-50 w-50"
                        />
                        <div className="w-full text-center">
                            <span className="mx-auto">
                                A good token icon would have a height and width 1:1. Please make sure it looks good before uploading.
                            </span>
                        </div>
                    </div>
                )
            }
        </>
    );
}

function ErrorPage({ error, setError }: {
    error: string,
    setError: (err: string) => void
}) {
    return (
        <div className="flex flex-col h-full w-full bg-red rounded-lg">
            <div className="mx-auto">
                <TbFaceIdError size={80} />
            </div>
            <span className="my-2 font-bold mx-auto text-4xl">ERROR</span>
            <div className="mx-auto text-center">
                <span>{error}</span>
            </div>
            <div className="my-4 p-4 mx-auto border-4 border-black rounded-lg text-center bg-white shadow-pop-small hover:cursor-pointer active:translate-y-2 active:shadow-none" onClick={() => setError("")}>
                <span className="font-[family-name:Tektur] font-semibold">Close</span>
            </div>
        </div>
    )
}

function PageOne({ error, tokenForm, acceptedFileTypes, disabled, handleDrop, handleFormChange, handleFileChange, clickNextPage, setTempIconUrl }: {
    error: string,
    tokenForm: TokenForm,
    acceptedFileTypes: string,
    disabled: boolean,
    handleDrop: (evt: DragEvent<HTMLDivElement>) => void,
    handleFormChange: (evt: ChangeEvent<HTMLInputElement>) => void,
    handleFileChange: (evt: ChangeEvent<HTMLInputElement>) => void,
    clickNextPage: () => void,
    setTempIconUrl: (url: string) => void
}) {
    const tokenIconRef = useRef<HTMLInputElement | null>(null);

    return (
        <div className="flex flex-col pb-16">
            {
                error && (
                    <div className="w-full bg-red text-center rounded-tl-lg rounded-tr-lg font-[family-name:Tektur]">
                        <span>❌<span className="font-bold">Error:</span> {error}</span>
                    </div>
                )
            }

            <div className="flex flex-col p-4">
                <div className="flex flex-row">
                    <RiHandCoinLine size={74} />
                    <span className="my-auto font-black text-3xl md:text-5xl">TOKEN INFO</span>
                </div>

                <div className="flex flex-col font-[family-name:Tektur] lg:mx-auto w-full">
                    <div className="flex flex-col md:flex-row w-full">
                        <div className="flex flex-col md:mx-2 w-full">
                            <label htmlFor="name" className="ml-1 font-semibold">Token Name:</label>
                            <input
                                name="name"
                                type="text"
                                placeholder="NEET Coin"
                                value={tokenForm.name}
                                onChange={handleFormChange}
                                autoComplete="off"
                                className="bg-white p-1 border-3 border-black rounded-lg w-full"
                            />
                        </div>
                        <div className="flex flex-col md:mx-2 w-full">
                            <label htmlFor="symbol" className="ml-1 font-semibold">Ticker Symbol:</label>
                            <input
                                name="symbol"
                                type="text"
                                placeholder="UWU"
                                value={tokenForm.symbol}
                                onChange={handleFormChange}
                                autoComplete="off"
                                className="bg-white p-1 border-3 border-black rounded-lg w-full"
                            />
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => tokenIconRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e)}
                    className="mx-auto my-4 w-full hover:cursor-pointer flex flex-col border-3 border-dashed rounded-lg w-full text-center p-4"
                >
                    {
                        tokenForm.file === null ?
                            <NoPictureComponent />
                            :
                            <PictureComponent picture={tokenForm.file} setTempIconUrl={setTempIconUrl} />
                    }
                </div>

                <input
                    type="file"
                    multiple={false}
                    ref={tokenIconRef}
                    accept={acceptedFileTypes}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <div className="w-full relative">
                    <NextButton disabled={disabled} clickNextPage={clickNextPage} />
                </div>
            </div>
        </div>
    );
}

function PageTwo({ tokenForm, error, disabled, handleFormChange, clickNextPage, clickPrevPage }: {
    tokenForm: TokenForm
    disabled: boolean,
    error: string,
    handleFormChange: (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    clickNextPage: () => void
    clickPrevPage: () => void
}) {
    return (
        <div className="flex flex-col pb-16">
            {
                error && (
                    <div className="w-full bg-red text-center rounded-tl-lg rounded-tr-lg font-[family-name:Tektur]">
                        <span>❌<span className="font-bold">Error:</span> {error}</span>
                    </div>
                )
            }
            <div className="flex flex-col my-4">
                <PrevButton clickPrevPage={clickPrevPage} />
                <div className="flex flex-row">
                    <BsDatabaseFill size={74} />
                    <span className="my-auto font-black text-3xl md:text-5xl">AMOUNT & DESC.</span>
                </div>
            </div>

            <div className="flex flex-col font-[family-name:Tektur] lg:mx-auto w-full px-2">
                <div className="flex flex-col md:flex-row w-full">
                    <div className="flex flex-col w-full">
                        <label htmlFor="name" className="mr-1 font-semibold">Supply:</label>
                        <input
                            name="supply"
                            type="text"
                            placeholder="1000000000"
                            value={tokenForm.supply}
                            onChange={handleFormChange}
                            autoComplete="off"
                            className="bg-white p-1 border-3 border-black rounded-lg w-full"
                        />
                        <span className="text-xs">{"Common supply is 1-Billion (1,000,000,000)"}</span>
                    </div>
                    <div className="flex flex-col md:ml-2 w-full">
                        <label htmlFor="symbol" className="ml-1 font-semibold">Decimals:</label>
                        <input
                            name="decimals"
                            type="text"
                            placeholder="9"
                            value={tokenForm.decimals}
                            onChange={handleFormChange}
                            autoComplete="off"
                            className="bg-white p-1 border-3 border-black rounded-lg w-full"
                        />
                        <span className="text-xs">{"Place a value between 0 and 18."}</span>
                    </div>
                </div>
                <div className="flex flex-col w-full my-2">
                    <label htmlFor="description" className="ml-1 font-semibold">Decription:</label>
                    <textarea
                        name="description"
                        placeholder="Describe the purpose of your token. What do you wish to achieve?"
                        rows={4}
                        className="bg-white border-3 border-black w-full rounded-lg"
                        value={tokenForm.description}
                        onChange={handleFormChange}
                    />
                </div>

                <div className="p-1">
                    <div className="w-full relative">
                        <NextButton disabled={disabled} clickNextPage={clickNextPage} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function PageThree({ tokenForm, clickPrevPage, handleFormChange, toggleModifyCreatorData, toggleRevokeAuth, clickNextPage, setMintAddress }: {
    tokenForm: TokenForm,
    clickPrevPage: () => void,
    handleFormChange: (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    toggleModifyCreatorData: () => void,
    toggleRevokeAuth: (name: "freeze" | "mint" | "update") => void,
    clickNextPage: () => void,
    setMintAddress: (addr: string) => void
}) {
    const [displayPrice, setDisplayPrice] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const { publicKey, signTransaction } = useWallet();

    async function handleSubmit() {
        setLoading(true);

        if (!publicKey || !signTransaction) {
            console.error("setWallet didn't fully load in!");
            setError("There was a rendering issue. Please try again.");
            setLoading(false);
            return;
        }

        try {
            const reqTransaction = await fetch("/api/transaction", {
                method: "POST",
                body: JSON.stringify({
                    publicKey: publicKey.toString(),
                    tokenForm: tokenForm
                }),
            });

            const transactionJSON = await reqTransaction.json();

            if (!reqTransaction.ok) {
                setError(transactionJSON.msg);
            }

            const transactionBuffer = Buffer.from(transactionJSON.transaction, "base64");
            const deserializedTx = Transaction.from(transactionBuffer);
            const transactionId: string = transactionJSON.transactionId;

            const signedTx = await signTransaction(deserializedTx);

            if (!tokenForm.file) {
                setError("Missing token icon! Please re-upload.");
            }

            const tokenFormData = new FormData();

            tokenFormData.append("signedTx", signedTx.serialize().toString("base64"));
            tokenFormData.append("transactionId", transactionId);
            tokenFormData.append("tokenIcon", tokenForm.file!);

            const getFinalResponse = await fetch("/api/submit-transaction", {
                method: "POST",
                body: tokenFormData,
            });

            const { msg, mintAddress } = await getFinalResponse.json();

            if (!getFinalResponse.ok) {
                setError(msg);
            } else {
                setMintAddress(mintAddress);
                clickNextPage();
            }
        } catch (err) {
            console.error(err);
        }
        
        setLoading(false);
    }

    type Authority = {
        name: "freeze" | "mint" | "update",
        title: string,
        desc: string,
        enabled: boolean,
        icon: IconType
    };

    const authorities: Authority[] = [
        {
            name: "freeze",
            title: "Revoke Freeze",
            desc: "Freeze Authority allows you to freeze token accounts of holders.",
            enabled: tokenForm.revokeFreeze,
            icon: GiIceCube
        },
        {
            name: "mint",
            title: "Revoke Mint",
            desc: "Mint Authority allows you to mint more supply of your token.",
            enabled: tokenForm.revokeMint,
            icon: GiCoinsPile
        },
        {
            name: "update",
            title: "Revoke Update",
            desc: "Update Authority allows you to update the token metadata about your token.",
            enabled: tokenForm.revokeUpdate,
            icon: FaPencilAlt
        }
    ];

    useEffect(() => {
        const initPrice = 0.2;
        let modifyCreatorData = 0;
        let revokeFreeze = 0;
        let revokeMint = 0;
        let revokeAuth = 0;

        if (tokenForm.modifyCreatorData === true) {
            modifyCreatorData = 0.1;
        } else {
            modifyCreatorData = 0;
        }

        if (tokenForm.revokeFreeze === false) {
            revokeFreeze = 0.1
        } else {
            revokeFreeze = 0;
        }

        if (tokenForm.revokeMint === false) {
            revokeMint = 0.1;
        } else {
            revokeMint = 0;
        }

        if (tokenForm.revokeUpdate === false) {
            revokeAuth = 0.1;
        } else {
            revokeAuth = 0;
        }

        const newPrice = initPrice + modifyCreatorData + revokeFreeze + revokeMint + revokeAuth;

        setDisplayPrice(parseFloat(newPrice.toFixed(1)));

    }, [tokenForm]);

    return (
        <div className="flex flex-col">
            {
                error ?
                    (
                        <ErrorPage error={error} setError={setError} />
                    )
                    :
                    (
                        <>
                            <div className="flex flex-col my-4">
                                <PrevButton clickPrevPage={clickPrevPage} />
                                <div className="flex flex-row mx-1">
                                    <IoShareSocialSharp size={40} />
                                    <div className="flex flex-col">
                                        <div className="flex flex-row">
                                            <span className="my-auto font-black text-3xl md:text-5xl">SOCIALS</span>
                                            <span className="font-[family-name:Tektur] text-sm">{"(optional)"}</span>
                                        </div>
                                        <span className="font-[family-name:Tektur] text-xs ml-1">{"Metadata for your token's organization."}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full flex flex-col md:flex-row px-2 ">
                                <div className="flex flex-col font-[family-name:Tektur] lg:w-1/2 md:mx-auto my-1 md:mr-1">
                                    <label htmlFor="" className="flex flex-row">
                                        <div className="mx-1">
                                            <FaTwitter className="h-full" size={12} />
                                        </div>
                                        Twitter:
                                    </label>
                                    <input
                                        type="text"
                                        name="twitter"
                                        autoComplete="off"
                                        placeholder="https://twitter.com/instacoin"
                                        className="border-3 border-black bg-white rounded-lg"
                                    />
                                </div>

                                <div className="flex flex-col font-[family-name:Tektur] lg:w-1/2 md:mx-auto my-1 md:ml-1">
                                    <label htmlFor="" className="flex flex-row">
                                        <div className="mx-1">
                                            <FaTelegram className="h-full" size={12} />
                                        </div>
                                        Telegram Channel:
                                    </label>
                                    <input
                                        type="text"
                                        name="telegram"
                                        autoComplete="off"
                                        placeholder="https://t.me/channel_name"
                                        className="border-3 border-black bg-white rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="w-full flex flex-col md:flex-row px-2 ">
                                <div className="flex flex-col font-[family-name:Tektur] lg:w-1/2 md:mx-auto my-1 md:mr-1">
                                    <label htmlFor="" className="flex flex-row">
                                        <div className="mx-1">
                                            <FaDiscord className="h-full" size={12} />
                                        </div>
                                        Discord Server:
                                    </label>
                                    <input
                                        type="text"
                                        name="discord"
                                        autoComplete="off"
                                        placeholder="https://discord.gg/server_link"
                                        className="border-3 border-black bg-white rounded-lg"
                                    />
                                </div>

                                <div className="flex flex-col font-[family-name:Tektur] lg:w-1/2 md:mx-auto my-1 md:ml-1">
                                    <label htmlFor="" className="flex flex-row">
                                        <div className="mx-1">
                                            <FaGlobe className="h-full" size={12} />
                                        </div>
                                        Website URL:
                                    </label>
                                    <input
                                        type="text"
                                        name="website"
                                        autoComplete="off"
                                        placeholder="https://instacoin.app/"
                                        className="border-3 border-black bg-white rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-row mt-4 mx-1">
                                <div>
                                    <FaFileSignature size={40} />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex flex-row">
                                        <span className="my-auto font-black text-3xl md:text-5xl">CREATOR INFO</span>
                                        <span className="font-[family-name:Tektur] text-sm">{"(optional)"}</span>
                                    </div>
                                    <span className="font-[family-name:Tektur] text-xs ml-1">Change the creator information. The default is Instacoin.app.</span>
                                </div>
                            </div>

                            <div className="flex flex-col px-2">
                                <div className="flex flex-row justify-end w-full ">
                                    <span className={`${tokenForm.modifyCreatorData ? "" : "line-through decoration-2"} text-sm my-auto mx-2 font-[family-name:Tektur]`}>{"(+0.1 SOL)"}</span>
                                    <Switch active={tokenForm.modifyCreatorData} onClick={toggleModifyCreatorData} />
                                </div>
                                {
                                    tokenForm.modifyCreatorData && (
                                        <div className="flex flex-col font-[family-name:Tektur]">
                                            <label htmlFor="creator" className="ml-1 my-auto">Creator Name:</label>
                                            <input
                                                type="text"
                                                name="creator"
                                                className="text-lg p-1 bg-white border-3 border-black rounded-lg"
                                                placeholder="Your Organization Name"
                                                value={tokenForm.creator}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                    )
                                }
                            </div>

                            <div className="flex flex-row mt-4 mx-1">
                                <div>
                                    <FaLock size={40} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="my-auto font-black text-2xl md:text-5xl">REVOKE AUTHORITIES</span>
                                    <span className="font-[family-name:Tektur] text-sm md:text-md ml-1">
                                        Solana Token has 3 authorities: Freeze Authority, Mint Authority, and Update Authority. Revoke them to attract more investors. We <span className="font-bold">HIGHLY</span> recommend enabling these 3 options for gaining more trust.
                                    </span>

                                    <span className="font-[family-name:Tektur] text-xs ml-1 my-4">
                                        *NOTE*: All 3 authorities are revoked by default for no extra charge. Disabling each option will increase the price of your order. We DO NOT recommend doing this.
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row p-2">
                                {
                                    authorities.map((auth, i) => (
                                        <div
                                            key={i}
                                            onClick={() => toggleRevokeAuth(auth.name)}
                                            className={`transition-all duration-300 ease-in-out hover:cursor-pointer hover:-translate-y-5 hover:shadow-pop-small active:-translate-y-5 active:shadow-pop-small p-3 m-2 flex flex-col font-[family-name:Tektur] border-3 border-black rounded-lg ${auth.enabled ? "bg-pink" : "bg-red text-white"} md:w-1/3`}
                                        >
                                            <div className="flex flex-row md:flex-col lg:flex-row justify-between w-full">
                                                <auth.icon size={30} />
                                                <div className="font-[family-name:Tektur] my-auto mr-2">
                                                    <span className={`${auth.enabled ? "line-through decoration-2" : "animate-shake animate-once"}`}>{"(+0.1 SOL)"}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-between h-full mt-2">
                                                <span className="font-bold text-lg">{auth.title}</span>
                                                <span className="text-sm">{auth.desc}</span>
                                                <div className="border-3 border-black rounded-lg text-center bg-white my-2 p-2 text-red">
                                                    <span className="text-black">{auth.enabled ? "ENABLED" : "DISABLED"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                            <div className="flex flex-col md:flex-row justify-end px-4">

                                <div className="flex flex-row my-auto mx-auto mb-2 md:my-auto md:mx-2">
                                    <div className="mx-2">
                                        <FaCartShopping className="h-full" size={20} />
                                    </div>
                                    <span className="font-bold underline decoration-2">Total:</span>
                                    <span className="mx-1">{displayPrice}SOL</span>
                                </div>

                                <div
                                    onClick={handleSubmit}
                                    className="flex border-4 border-black rounded-lg bg-white p-4 mb-2 shadow-pop-small hover:cursor-pointer active:translate-y-2 active:shadow-none"
                                >
                                    {
                                        loading ?
                                            <div className="flex flex-row">
                                                <div className="animate-spin">
                                                    <TbFidgetSpinner className="h-full" size={20} />
                                                </div>
                                                <span className="ml-2 font-bold">Loading...</span>
                                            </div>
                                            :
                                            (
                                                <div className="flex flex-row mx-auto">
                                                    <div>
                                                        <IoSparklesSharp className="h-full" size={20} />
                                                    </div>
                                                    <span className="ml-2 font-bold">Create Token</span>
                                                </div>
                                            )
                                    }
                                </div>

                            </div>
                        </>
                    )
            }
        </div >
    );
}

function CompletePage({ tokenForm, tempIconUrl, mintAddress, startOver }: {
    tokenForm: TokenForm,
    tempIconUrl: string,
    mintAddress: string,
    startOver: () => void
}) {
    const [miniAddr, setMiniAddr] = useState<string>("");

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(mintAddress);
        } catch(e) {
            console.error("Couldn't copy text:", e);
        }
    }

    useEffect(() => {
        let minifiedLeft: string = "";
        let minifiedRight: string = "";

        for (let i = 0; i < 5; i++) {
            const leftChar = mintAddress[i];
            const rightChar = mintAddress[(mintAddress.length - 1) - i];

            minifiedLeft += leftChar;
            minifiedRight = `${rightChar}${minifiedRight}`;
        }

        setMiniAddr(`${minifiedLeft}...${minifiedRight}`);
    }, [mintAddress]);

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col w-full text-center my-4 animate-fade-down animate-once animate-ease-in-out">
                <span className="font-bold mx-auto text-2xl lg:text-4xl">🎉 CONGRATULATIONS!</span>
                <span className="mx-auto">This is the start of something amazing!</span>
            </div>
            <img
                src={tempIconUrl}
                alt=""
                height={120}
                width={120}
                className="h-40 w-40 my-4 mx-auto outline-5 rounded-full shadow-pop animate-jump animate-once animate-delay-1000 animate-ease-linear"
            />
            <div className="w-full flex flex-col text-center animate-fade-down animate-once animate-ease-in-out animate-delay-1200">
                <span className="font-bold text-xl">{tokenForm.name}</span>
                <span className="font-[family-name:Tektur] text-sm">{`[${tokenForm.symbol}]`}</span>
                <span>Is now on the blockchain!</span>
            </div>

            <div className="flex flex-col mx-auto my-4 w-4/5 md:w-3/5">
                <div className="flex flex-col mx-auto my-2 w-full" onClick={copyToClipboard}>
                    <div className="flex flex-row bg-white text-center border-4 border-black rounded-lg p-2 shadow-pop-small active:translate-y-1 active:shadow-none active:bg-pink active:text-white hover:bg-purple hover:cursor-pointer">
                        <div className="mx-1">
                            <FaCopy />
                        </div>
                        <span className="hidden lg:block font-bold text-sm">{mintAddress}</span>
                        <span className="lg:hidden font-bold text-sm">{miniAddr}</span>
                    </div>
                </div>

                <div className="flex flex-col mx-auto my-2 w-full">
                    <div className="flex flex-row bg-white text-center border-4 border-black rounded-lg p-2 shadow-pop-small active:translate-y-1 active:shadow-none active:bg-pink active:text-white hover:bg-purple hover:cursor-pointer">
                        <div className="mx-1">
                            <MdOutlineAddCircle className="h-full" />
                        </div>
                        <span className="font-bold text-sm">Add to Token List</span>
                    </div>
                </div>

                <Link href={`https://solscan.io/token/${mintAddress}?cluster=devnet`} target="_blank">
                    <div className="flex flex-col mx-auto my-2 w-full">
                        <div className="flex flex-row bg-white text-center border-4 border-black rounded-lg p-2 shadow-pop-small active:translate-y-1 active:shadow-none active:bg-pink active:text-white hover:bg-purple hover:cursor-pointer">
                            <div className="mx-1">
                                <FaExternalLinkAlt />
                            </div>
                            <span className="font-bold text-sm">View on Solscan</span>
                        </div>
                    </div>
                </Link>

                <Link href="https://raydium.io/liquidity/create-pool/" target="_blank">
                    <div className="flex flex-col mx-auto my-2 w-full">
                        <div className="flex flex-row bg-white text-center border-4 border-black rounded-lg p-2 shadow-pop-small active:translate-y-1 active:shadow-none active:bg-pink active:text-white hover:bg-purple hover:cursor-pointer">
                            <div className="mx-1">
                                <FaExternalLinkAlt />
                            </div>
                            <span className="font-bold text-sm">Create Liquidity</span>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="flex w-full mb-8">
                <div className="mx-auto border-4 border-black rounded-lg p-4 bg-white shadow-pop-small active:translate-y-1 active:shadow-none active:bg-pink hover:cursor-pointer hover:bg-purple" onClick={startOver}>
                    <span className="font-semibold font-[family-name:Tektur]">Start Over?</span>
                </div>
            </div>
        </div>
    )
}

function PageFour({ tokenForm, mintAddress, tempIconUrl, clickPrevPage, startOver }: {
    tokenForm: TokenForm,
    mintAddress: string,
    tempIconUrl: string,
    clickPrevPage: () => void,
    startOver: () => void
}) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    function closeErrorPage() {
        setError("");
        clickPrevPage();
    }

    useEffect(() => {
        setLoading(false);
    }, [loading]);

    return (
        <>
            {
                error ?
                    <ErrorPage error={error} setError={closeErrorPage} />
                    :
                    (
                        loading ?
                            <div className="flex flex-col w-full my-4">
                                <TbFidgetSpinner className="mx-auto animate-spin" size={80} />
                                <div className="flex flex-col my-4 w-full text-center">
                                    <span className="font-bold text-4xl">MINTING...</span>
                                    <span className="font-[family-name:Tektur]">{"Give us a sec... Greatness is on the way!"}</span>
                                </div>
                            </div>
                            :
                            <CompletePage tokenForm={tokenForm} tempIconUrl={tempIconUrl} mintAddress={mintAddress} startOver={startOver} />
                    )
            }
        </>
    );
}

export default function CreateTokenForm({ page, setPage }: {
    page: 0 | 1 | 2 | 3,
    setPage: (page: 0 | 1 | 2 | 3) => void
}) {
    const [tokenForm, setTokenForm] = useState<TokenForm>(initTokenForm);
    const [error, setError] = useState<string>("");
    const [disabled, setDisabled] = useState<boolean>(true);
    const [tempIconUrl, setTempIconUrl] = useState<string>("");
    const [mintAddress, setMintAddress] = useState<string>("");

    const acceptedFileExtensions = ["jpg", "png", "jpeg", "jfif", "jpj", "gif", "pjpeg"];
    const acceptedFileTypeString = acceptedFileExtensions.map((ext) => `.${ext}`).join(',');

    function startOver() {
        setPage(0);
        setError("");
        setTokenForm(initTokenForm);
    }

    function toggleRevokeAuth(name: "freeze" | "mint" | "update") {
        switch (name) {
            case "freeze":
                const newFreezeState = !tokenForm.revokeFreeze;
                setTokenForm({ ...tokenForm, revokeFreeze: newFreezeState });
                break;
            case "mint":
                const newMintState = !tokenForm.revokeMint;
                setTokenForm({ ...tokenForm, revokeMint: newMintState });
                break;
            case "update":
                const newUpdateState = !tokenForm.revokeUpdate;
                setTokenForm({ ...tokenForm, revokeUpdate: newUpdateState });
                break;
            default:
                console.error("Reached unreachable revokeAuth");
                break;
        }
    }

    function toggleModifyCreatorData() {
        const newModifyCreatorDataState = !tokenForm.modifyCreatorData;
        setTokenForm({ ...tokenForm, modifyCreatorData: newModifyCreatorDataState });
    }

    function clickNextPage() {
        switch (page) {
            case 0:
                setPage(1);
                break;
            case 1:
                setPage(2);
                break;
            case 2:
                setPage(3);
                break;
            default:
                console.error("How did you get here?");
                break;
        }

        setError("");
    }

    function clickPrevPage() {
        switch (page) {
            case 1:
                setPage(0);
                break;
            case 2:
                setPage(1);
                break;
            case 3:
                setPage(2);
                break;
            default:
                console.error("How did you get here?");
                break;
        }
    }

    function processFile(files: FileList) {
        if (files.length > 1) {
            setError("Please select only one file.");
        } else {
            const checkFile = files[0];
            let allowed = false;

            if (checkFile.size > 5000000) { // Check if it is 5MB
                setError("File size exceeded. Please keep it below 5MB.");
                return;
            }

            for (const ext of acceptedFileExtensions) {
                const checkExtension = checkFile.name.slice(checkFile.name.length - ext.length, checkFile.name.length);
                if (checkExtension === ext && allowed === false && (checkFileType(checkFile.type))) {
                    allowed = true;
                    break;
                }
            }

            if (allowed) {
                setTokenForm({ ...tokenForm, file: checkFile });
                setError("");
            } else {
                setError("Invalid file type!");
            }
        }
    }

    function handleFormChange(evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = evt.target;

        if (name === "symbol" && value.length > 8) return;
        if (name === "name" && value.length > 30) return;

        setTokenForm({ ...tokenForm, [name]: value });
    }

    function handleFileChange(evt: ChangeEvent<HTMLInputElement>) {
        if (evt.target.files) {
            processFile(evt.target.files);
        }
    }

    function checkFileType(fileType: string) {
        switch (fileType) {
            case "image/jpeg":
                return true;
            case "image/gif":
                return true;
            case "image/png":
                return true;
            default:
                return false;
        }
    }

    function handleDrop(evt: DragEvent<HTMLDivElement>) {
        evt.preventDefault();
        processFile(evt.dataTransfer.files);
    }

    useEffect(() => {
        function checkPageOne() {
            if (tokenForm.file !== null && tokenForm.name && tokenForm.symbol) {
                return true;
            } else {
                return false;
            }
        }

        function checkPageTwo() {
            let supplyPass = false;
            let decimalsPass = false;
            let descriptionPass = false;

            if (tokenForm.supply >= 1) {
                supplyPass = true;
            } else {
                setError("Supply needs to be 1 (one).");
                supplyPass = false;
            }

            if (tokenForm.decimals >= 0 && tokenForm.decimals <= 18) {
                decimalsPass = true;
            } else {
                setError("Decimals needs to be 0 or 18, or any number in between.");
                decimalsPass = false;
            }

            if (tokenForm.description.length) {
                descriptionPass = true;
            } else {
                descriptionPass = false;
            }

            if (supplyPass && decimalsPass && descriptionPass) {
                setError("");
                return true;
            } else {
                return false;
            }
        }

        if (page === 0 && checkPageOne()) {
            setDisabled(false);
        } else if (page === 1 && checkPageTwo()) {
            setDisabled(false);
        } else if (page === 2) {

        } else {
            setDisabled(true);
        }
    }, [tokenForm, page]);

    return (
        <>
            {
                page === 0 && (
                    <PageOne
                        error={error}
                        tokenForm={tokenForm}
                        acceptedFileTypes={acceptedFileTypeString}
                        disabled={disabled}
                        handleDrop={handleDrop}
                        handleFormChange={handleFormChange}
                        handleFileChange={handleFileChange}
                        clickNextPage={clickNextPage}
                        setTempIconUrl={setTempIconUrl}
                    />
                )
            }

            {
                page === 1 && (
                    <PageTwo
                        error={error}
                        tokenForm={tokenForm}
                        disabled={disabled}
                        handleFormChange={handleFormChange}
                        clickNextPage={clickNextPage}
                        clickPrevPage={clickPrevPage}
                    />
                )
            }

            {
                page === 2 && (
                    <PageThree
                        tokenForm={tokenForm}
                        clickPrevPage={clickPrevPage}
                        toggleModifyCreatorData={toggleModifyCreatorData}
                        handleFormChange={handleFormChange}
                        toggleRevokeAuth={toggleRevokeAuth}
                        clickNextPage={clickNextPage}
                        setMintAddress={setMintAddress}
                    />
                )
            }

            {
                page === 3 && (
                    <PageFour
                        tokenForm={tokenForm}
                        mintAddress={mintAddress}
                        tempIconUrl={tempIconUrl}
                        clickPrevPage={clickPrevPage}
                        startOver={startOver}
                    />
                )
            }
        </>
    );
}