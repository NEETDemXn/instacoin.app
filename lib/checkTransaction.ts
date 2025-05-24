import { Connection } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com/", "confirmed");

type Confirmation = {
    confirmationStatus: string,
    confirmations: number,
    err: string | null,
    slot: number,
    status: { Ok: string | null}
}

export async function checkTransaction(signature: string) {
    const latestBlockhash = await connection.getLatestBlockhash();
    const { value: confirmation } = await connection.confirmTransaction(
        {
            signature,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
        },
        "confirmed"
    );

    const confirmationData = confirmation as Confirmation;

    if (confirmationData.confirmationStatus === "confirmed") {
        return true;
    }

    return false;
}