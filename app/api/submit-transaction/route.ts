export const dynamic = "force-static";

import { NextRequest, NextResponse } from "next/server";
import { Connection, Transaction } from "@solana/web3.js";

import { mintToken } from "@/lib/mintToken";

export async function POST(req: NextRequest) {
    const form = await req.formData();

    const formSignedTx = form.get("signedTx");
    const formTransactionId = form.get("transactionId");
    const formTokenIcon = form.get("tokenIcon");

    if (!formSignedTx || !formTransactionId || !formTokenIcon) {
        return NextResponse.json({ msg: "Missing required form data." }, { status: 400 });
    }

    const signedTx = formSignedTx as string;
    const transactionId = formTransactionId as string;
    const tokenIcon = formTokenIcon as File;

    try {
        const connection = new Connection("https://api.devnet.solana.com/", "confirmed");
        const transactionBuffer = Buffer.from(signedTx as string, "base64");
        const deserializedTx = Transaction.from(transactionBuffer);

        const signature = await connection.sendRawTransaction(deserializedTx.serialize(), {
            skipPreflight: false,
            preflightCommitment: "confirmed",
        });

        const { value: confirmation } = await connection.confirmTransaction(
            {
                signature,
                blockhash: (await connection.getLatestBlockhash()).blockhash,
                lastValidBlockHeight: (await connection.getLatestBlockhash()).lastValidBlockHeight,
            },
            "confirmed"
        );

        if (confirmation.err) {
            console.error("Transaction failed:", confirmation.err);
            return NextResponse.json({ msg: "There was a server error. Please reach out on Twitter before trying again." }, { status: 500 });
        }

        const mintAddress = await mintToken(transactionId, tokenIcon);

        if (!mintAddress) {
            throw new Error("Missing mint address!");
        }

        return NextResponse.json({ msg: "Transaction success!", signature, mintAddress });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ msg: "There was a server error. Please try again." }, { status: 500 });
    }
}