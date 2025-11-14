import { Connection, PublicKey, Keypair, clusterApiUrl, sendAndConfirmTransaction, Transaction, SystemProgram, type TransactionInstruction } from "@solana/web3.js";
import {
    TOKEN_2022_PROGRAM_ID,
    mintToChecked,
    createAssociatedTokenAccount,
    ExtensionType,
    TYPE_SIZE,
    LENGTH_SIZE,
    getMintLen,
    createInitializeMetadataPointerInstruction,
    createInitializeMintInstruction,
    createInitializeInstruction,
    createUpdateFieldInstruction,
    createUpdateAuthorityInstruction,
    AuthorityType,
    setAuthority
} from "@solana/spl-token";
import { TokenMetadata, pack } from "@solana/spl-token-metadata";
import bs58 from "bs58";
import sharp from "sharp";
import { PinataSDK } from "pinata";
import { serverClient } from "./supabaseServerClient";

const APP_KEY = bs58.decode(process.env.APP_PRIV_KEY!);
const pinataJwt = process.env.PINATA_JWT;
const pinataGateway = process.env.PINATA_GATEWAY;

const payer = Keypair.fromSecretKey(APP_KEY);
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

interface Metadata {
    name: string,
    symbol: string,
    description: string,
    image: string,
    extensions: {
        creator: string
        discord?: string,
        twitter?: string,
        telegram?: string,
        website?: string,
    }
};

export async function mintToken(transactionId: string, image: File) {
    const mint = Keypair.generate();
    const supabase = serverClient();

    if(!supabase) {
        console.error("Supabase connection error");
        return null;
    }

    const { data: sbTransactions, error } = await supabase.from("transaction").select("*").eq("id", transactionId);

    if (error) {
        console.error("Supabase select error:", error);
        return null;
    }

    const txReq = sbTransactions[0];
    const owner = new PublicKey(txReq["public_key"]);
    const name: string = txReq["name"];
    const symbol: string = txReq["symbol"];
    const description: string = txReq["description"];
    const supply: number = txReq["supply"];
    const decimals: number = txReq["decimals"];
    const revokeUpdate: boolean = txReq["revoke_update"];
    const revokeMint: boolean = txReq["revoke_mint"];
    const revokeFreeze: boolean = txReq["revoke_freeze"];
    const creator: string = txReq["creator"];
    const discord: string | null = txReq["discord"];
    const twitter: string | null = txReq["twitter"];
    const telegram: string | null = txReq["telegram"];
    const website: string | null = txReq["website"];

    const imageBuf = await image.arrayBuffer();
    const resizedBuf = (await sharp(imageBuf).resize(420, 420).toBuffer()).toString("base64");

    const pinata = new PinataSDK({
        pinataJwt,
        pinataGateway
    });

    const uploadImgRes = await pinata.upload.public.base64(resizedBuf);

    if (!uploadImgRes.cid) {
        console.error("Pinata error uploading image");
        return null;
    }

    const initMetadata: Metadata = {
        name,
        symbol,
        description,
        image: `https://${pinataGateway}/ipfs/${uploadImgRes.cid}`,
        extensions: {
            creator
        }
    };

    const uploadMetadataRes = await pinata.upload.public.json(initMetadata);

    if (!uploadMetadataRes.cid) {
        console.error("Pinata error uploading uri");
        return null;
    }

    const metadata: TokenMetadata = {
        updateAuthority: payer.publicKey,
        mint: mint.publicKey,
        name,
        symbol,
        uri: `https://${pinataGateway}/ipfs/${uploadMetadataRes.cid}`,
        additionalMetadata: [["description", description], ["creator", creator]],
    };

    if (discord) {
        initMetadata.extensions.discord = discord;
        metadata.additionalMetadata.push(["discord", discord]);
    } 
    
    if (twitter) {
        initMetadata.extensions.twitter = twitter; 
        metadata.additionalMetadata.push(["twitter", twitter]);
    } 
    
    if (telegram) {
        initMetadata.extensions.telegram = telegram;
        metadata.additionalMetadata.push(["telegram", telegram]);
    }

    if (website) {
        initMetadata.extensions.website = website;
        metadata.additionalMetadata.push(["website", website]);
    } 

    if (creator) {
        initMetadata.extensions.creator = creator;
        metadata.additionalMetadata.push(["creator", creator]);
    } 

    const metadataExtension = TYPE_SIZE + LENGTH_SIZE;
    const metadataLen = pack(metadata).length;
    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataExtension + metadataLen);

    const initMetaDataPointerInstruction = createInitializeMetadataPointerInstruction(mint.publicKey, payer.publicKey, mint.publicKey, TOKEN_2022_PROGRAM_ID);

    const initMintInstruction = createInitializeMintInstruction(mint.publicKey, 9, payer.publicKey, payer.publicKey, TOKEN_2022_PROGRAM_ID);

    const initInstruction = createInitializeInstruction({
        metadata: mint.publicKey,
        updateAuthority: payer.publicKey,
        mint: mint.publicKey,
        mintAuthority: payer.publicKey,
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
        programId: TOKEN_2022_PROGRAM_ID,
    });

    const metadataUpdates: TransactionInstruction[] = [];

    // const updateFieldInstruction = createUpdateFieldInstruction({
    //     metadata: mint.publicKey,
    //     updateAuthority: payer.publicKey,
    //     field: metadata.additionalMetadata[0][0],
    //     value: metadata.additionalMetadata[0][1],
    //     programId: TOKEN_2022_PROGRAM_ID,
    // });

    for (const [field, value] of metadata.additionalMetadata) {
        const updateFieldInstruction = createUpdateFieldInstruction({
            metadata: mint.publicKey,
            updateAuthority: payer.publicKey,
            field,
            value,
            programId: TOKEN_2022_PROGRAM_ID
        });

        metadataUpdates.push(updateFieldInstruction);
    }

    const updateAuthorityInstruction = createUpdateAuthorityInstruction({
        metadata: mint.publicKey,
        oldAuthority: payer.publicKey,
        newAuthority: revokeUpdate ? null : owner,
        programId: TOKEN_2022_PROGRAM_ID
    });

    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: mint.publicKey,
            space: mintLen,
            lamports,
            programId: TOKEN_2022_PROGRAM_ID,
        }),
        initMetaDataPointerInstruction,
        initMintInstruction,
        initInstruction,
        // updateFieldInstruction,
    );

    for (const instruction of metadataUpdates) {
        transaction.add(instruction);
    }

    transaction.add(updateAuthorityInstruction);

    await sendAndConfirmTransaction(connection, transaction, [payer, mint]);
    const tokenAccountPubkey = await createAssociatedTokenAccount(connection, payer, mint.publicKey, owner, undefined, TOKEN_2022_PROGRAM_ID);
    await mintToChecked(connection, payer, mint.publicKey, tokenAccountPubkey, payer, 1e9 * supply, decimals, undefined, undefined, TOKEN_2022_PROGRAM_ID);

    await setAuthority(
        connection,
        payer,
        mint.publicKey,
        payer.publicKey,
        AuthorityType.MintTokens,
        revokeMint ? null : owner,
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID
    );

    await setAuthority(
        connection,
        payer,
        mint.publicKey,
        payer.publicKey,
        AuthorityType.FreezeAccount,
        revokeFreeze ? null : owner,
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID
    );

    // console.log(`mint: ${mint.publicKey}`);
    return mint.publicKey;
}