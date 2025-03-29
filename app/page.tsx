import Image from "next/image";
import Link from "next/link";

import Provider from "@/Components/Provider";
import Main from "./Main";

// Images
import Token from "@/public/token.svg";

function Navbar() {
  return (
    <div className="flex flex-col">
      <div className="flex w-full bg-white text-black">
        <div className="mx-auto">
          <span className="text-sm font-light">💖 Please be careful for any imitations of this app.</span>
        </div>
      </div>
      <div className="font-[family-name:var(--font-pixelfy)] flex flex-col lg:flex-row w-full bg-stone-950 text-white">
        <div className="flex flex-row m-2 mx-auto group hover:cursor-pointer">
          <Image src={Token} alt="" className="w-8 md:w-12" />
          <Link href="/">
            <div className="flex h-full m-auto">
              <span className="text-xl md:text-3xl my-auto mx-2 group-hover:underline group-active:underline decoration-2">InstaCoin</span>
            </div>
          </Link>
        </div>

        <div className="flex md:w-[90%] font-[family-name:var(--font-tektur)] mx-auto mb-2">
          <div className="m-auto flex flex-row">
            <div className="text-center flex flex-row">
              <span className="hover:underline active:underline hover:cursor-pointer mx-2 md:text-xl"><Link href="/">Create Token</Link></span>
              <div className="w-[1px] h-full bg-white mx-2"></div>
            </div>

            <div className="text-center flex flex-row">
              <span className="md:text-xl hover:underline active:underline hover:cursor-pointer"><Link href="/trending">Trending Tokens</Link></span>
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

export default function Home() {
  return (
    <div className="font-[family-name:Poppins]">
      <Navbar />
      <Provider>
        <Main />
      </Provider>
    </div>
  );
}
