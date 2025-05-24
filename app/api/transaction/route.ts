export const dynamic = "force-static";

import { NextResponse } from "next/server";
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;

// Types
import type { TokenForm } from "@/lib/types/TokenForm";

export async function POST(req: Request) {
    const { publicKey, tokenForm } = await req.json();

    if (!SUPABASE_KEY || !SUPABASE_URL) {
        console.error("Missing Supabase Service Key or URL");
        return NextResponse.json({ msg: "Server misconfigured. Sorry about that." }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    if (!publicKey || !tokenForm) {
        return NextResponse.json({ msg: "Missing `publicKey` or `tokenForm`.", transaction: null }, { status: 400 });
    }

    if (!tokenForm.name) {
        return NextResponse.json({ msg: "Missing token name." }, { status: 400 });
    }

    if (tokenForm.name.length > 30) {
        return NextResponse.json({ msg: "Token name must contain 1 to 30 characters." }, { status: 400 });
    }

    if (!tokenForm.symbol) {
        return NextResponse.json({ msg: "Missing token symbol." }, { status: 400 });
    }

    if (tokenForm.symbol.length > 8) {
        return NextResponse.json({ msg: "Token symbol must contain 1 to 8 characters." }, { status: 400 });
    }

    if (tokenForm.supply < 1) {
        return NextResponse.json({ msg: "Supply needs to be a number 1 or greater" }, { status: 400 });
    }

    if (tokenForm.decimals < 0 || tokenForm.decimals > 18) {
        return NextResponse.json({ msg: "Decimals need to be a number between 0 & 18." }, { status: 400 });
    }

    if (!tokenForm.description) {
        return NextResponse.json({ msg: "Missing token description." }, { status: 400 });
    }

    try {
        const form: TokenForm = tokenForm;
        const connection = new Connection("https://api.devnet.solana.com", "confirmed");
        const { blockhash } = await connection.getLatestBlockhash("confirmed");

        let transactionCost = 0.2;

        if (form.modifyCreatorData === true) transactionCost += 0.1;
        if (form.revokeFreeze === false) transactionCost += 0.1;
        if (form.revokeMint === false) transactionCost += 0.1;
        if (form.revokeUpdate === false) transactionCost += 0.1;

        const fixedCost = parseFloat(transactionCost.toFixed(1));

        const tx = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: new PublicKey(publicKey),
                toPubkey: new PublicKey("dadzze2tyBogDsQfQxXYUZ9ueXnKGH9j8QP7Qt9vi6e"),
                lamports: 1_000_000_000 * fixedCost,
            })
        );

        tx.recentBlockhash = blockhash;
        tx.feePayer = new PublicKey(publicKey);

        const {
            name,
            symbol,
            supply,
            decimals,
            description,
            discord,
            telegram,
            twitter,
            website,
            modifyCreatorData,
            creator,
            revokeFreeze,
            revokeMint,
            revokeUpdate,
        } = tokenForm;

        const { data, error } = await supabase
            .from("transaction")
            .insert([
                {
                    public_key: publicKey,
                    name,
                    symbol,
                    supply,
                    decimals,
                    description,
                    discord: discord ? discord : null,
                    telegram: telegram ? telegram : null,
                    twitter: twitter ? twitter : null,
                    website: website ? website : null,
                    modify_creator: modifyCreatorData,
                    creator: creator ? creator : null,
                    revoke_freeze: revokeFreeze,
                    revoke_mint: revokeMint,
                    revoke_update: revokeUpdate,
                },
            ])
            .select("*");

        if (error) {
            console.error(error);
            return NextResponse.json({ msg: "Server error." }, { status: 500 });
        }

        const serializedTx = tx.serialize({ requireAllSignatures: false }).toString("base64");

        if (data[0]["id"]) {
            return NextResponse.json({ msg: "Transaction requested", transaction: serializedTx, transactionId: data[0]["id"]})
        } else {
            return NextResponse.json({ msg: "Database Error." }, { status: 500 });
        }

    } catch (err) {
        console.error(err);
        return NextResponse.json({ msg: "There was a server error. Please try again later.", transaction: null }, { status: 500 });
    }
}
