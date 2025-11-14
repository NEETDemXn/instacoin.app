import Image from "next/image";
import Link from "next/link";

import Provider from "@/Components/Provider";
import RenderComponent from "./RenderComponent";
import Main from "./Main";

// Images
import Token from "@/public/token.svg";

// React Icons
import { FaRegQuestionCircle } from "react-icons/fa";


function Logo({ className }: {
  className?: string
}) {
  return (
    <div className={className}>
      <Image src={Token} alt="" className="w-8 md:w-12" />
      <Link href="/">
        <div className="flex h-full m-auto">
          <span className="text-xl md:text-3xl my-auto mx-2 group-hover:underline group-active:underline decoration-2">InstaCoin</span>
        </div>
      </Link>
    </div>
  );
}

function Navbar() {
  return (
    <div className="flex flex-col">
      <div className="flex w-full bg-white text-black">
        <div className="mx-auto">
          <span className="text-sm font-light">💖 Only used for the Solana-Devnet for now.</span>
        </div>
      </div>
      <div className="font-[family-name:var(--font-pixelfy)] flex flex-col lg:flex-row w-full bg-stone-950 text-white">
        <Logo className="flex flex-row m-2 mx-auto group hover:cursor-pointer" />

        <div className="flex md:w-[90%] font-[family-name:var(--font-tektur)] mx-auto mb-2">
          <div className="m-auto flex flex-row">
            <div className="text-center flex flex-row">
              <span className="hover:underline active:underline hover:cursor-pointer mx-2 md:text-xl"><Link href="/">Create Token</Link></span>
              <div className="w-[1px] h-full bg-white mx-2"></div>
            </div>

            <div className="text-center flex flex-row">
              <span className="md:text-xl hover:underline active:underline hover:cursor-pointer"><Link target="_blank" href="https://raydium.io/liquidity/create-pool/">Create Liquidity</Link></span>
              <div className="w-[1px] h-full bg-white mx-2"></div>
            </div>

            <div className="text-center">
              <span className="md:text-xl hover:underline active:underline hover:cursor-pointer"><Link target="_blank" href="https://raydium.io/portfolio/">Manage Liquidity</Link></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HowToUse() {
  return (
    <div className="mx-auto my-4 w-4/5 md:w-2/3 lg:w-[800px] border-3 border-black bg-green flex flex-col rounded-xl shadow-pop">
      <div className="m-2">
        <div className="flex flex-row font-black text-2xl">
          <FaRegQuestionCircle size={40} />
          <span className="my-auto mx-2">HOW TO USE</span>
        </div>
        <div className="m-2">
          <div className="text-xl my-4">
            <span className="font-semibold">1. 🔗 Connect your wallet</span>
            <p>Start by connecting your Solana wallet. (We recommend using the Phantom Wallet for the smoothest experience!)</p>
          </div>

          <div className="text-xl my-4">
            <span className="font-semibold">2. 🖊 Name Your Token</span>
            <p>Pick a token name and choose a ticker symbol—this is your token&apos;s identity, so make it memorable!</p>
          </div>

          <div className="text-xl my-4">
            <span className="font-semibold">3. 🖼 Add a Logo</span>
            <p>Upload a logo to represent your token. We suggest using a 1:1 square image to keep everything looking sharp.</p>
          </div>

          <div className="text-xl my-4">
            <span className="font-semibold">4. 🧮 Set Total Supply & Decimals</span>
            <p>Decide how many tokens you want to create and choose the decimal count. <span className="italic text-md">(Tip: Most Solana tokens use 9 decimals by default, which simply allows the token to be divided into very small units.)</span></p>
          </div>

          <div className="text-xl my-4">
            <span className="font-semibold">5. 🗣 Describe Your Token</span>
            <p>Tell the world what your token is all about! What makes it special? What is its purpose?</p>
          </div>

          <div className="text-xl my-4">
            <span className="font-semibold">6. 🌐 (Optional) Add Project Links</span>
            <p>Want people to find your community? Add your Discord, website, Telegram, or Twitter/X links.</p>
          </div>

          <div className="text-xl my-4">
            <span className="font-semibold">7. 🌟 (Optional) Add Creator Info</span>
            <p>Share the developer or company name behind the project—this helps build trust with users.</p>
          </div>

          <div className="text-xl my-4">
            <span className="font-semibold">8. 🦺 (Optional) Adjust Safety Settings</span>
            <p>You can choose to disable certain safety features if needed, though we recommend leaving them on for most projects.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-black text-white font-[family-name:var(--font-tektur)] flex md:flex-row sm:flex-col overflow-x-hidden justify-between">
      <Logo className="flex flex-row" />
      <div className="flex flex-col">
        <span className="hover:underline active:underline hover:cursor-pointer mx-2 md:text-xl"><Link href="/">Create Token</Link></span>
        <span className="md:text-xl hover:underline active:underline hover:cursor-pointer"><Link target="_blank" href="https://raydium.io/liquidity/create-pool/">Create Liquidity</Link></span>
        <span className="md:text-xl hover:underline active:underline hover:cursor-pointer"><Link target="_blank" href="https://raydium.io/portfolio/">Manage Liquidity</Link></span>
      </div>
      <div className="justify-end">Created with 💖 by Daniel Antonio</div>
    </footer>
  )
}

export default function Home() {
  return (
    <div className="flex flex-col font-[family-name:Poppins]">
      <Navbar />
      <Provider>
        <RenderComponent>
          <Main />
        </RenderComponent>
      </Provider>
      <HowToUse />
      <Footer />
    </div>
  );
}
