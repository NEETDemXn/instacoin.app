export type TokenForm = {
    name: string,
    symbol: string,
    file: File | null
    decimals: number,
    supply: number,
    description: string,
    twitter: string,
    telegram: string,
    discord: string,
    website: string,
    creator: string,
    modifyCreatorData: boolean
    revokeFreeze: boolean,
    revokeMint: boolean,
    revokeUpdate: boolean
};