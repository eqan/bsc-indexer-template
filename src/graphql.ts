
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum OrderTypeEnum {
    TRANSFER = "TRANSFER",
    MINT = "MINT",
    BURN = "BURN",
    BID = "BID",
    LIST = "LIST",
    SELL = "SELL",
    CANCEL_LIST = "CANCEL_LIST",
    CANCEL_BID = "CANCEL_BID",
    AUCTION_BID = "AUCTION_BID",
    AUCTION_CREATED = "AUCTION_CREATED",
    AUCTION_CANCEL = "AUCTION_CANCEL",
    AUCTION_FINISHED = "AUCTION_FINISHED",
    AUCTION_STARTED = "AUCTION_STARTED",
    AUCTION_ENDED = "AUCTION_ENDED"
}

export interface BlockChainInfoInput {
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    logIndex: number;
}

export interface FilterDto {
    page?: Nullable<number>;
    limit?: Nullable<number>;
    collectionId?: Nullable<string>;
    name?: Nullable<string>;
}

export interface FilterTokenDto {
    page?: Nullable<number>;
    limit?: Nullable<number>;
    tokenId?: Nullable<string>;
    name?: Nullable<string>;
}

export interface FilterActivityDto {
    page?: Nullable<number>;
    limit?: Nullable<number>;
    id: string;
}

export interface CreateCollectionsInput {
    collectionId: string;
    name: string;
    slug: string;
    bannerImageUrl?: Nullable<string>;
    externalUrl?: Nullable<string>;
    imageUrl?: Nullable<string>;
    twitterUserName?: Nullable<string>;
    discordUrl?: Nullable<string>;
    description?: Nullable<string>;
}

export interface UpdateCollectionsInput {
    collectionId: string;
    bannerImageUrl?: Nullable<string>;
    externalUrl?: Nullable<string>;
    imageUrl?: Nullable<string>;
    twitterUserName?: Nullable<string>;
    discordUrl?: Nullable<string>;
    description?: Nullable<string>;
}

export interface DeleteCollectionsInput {
    id: string[];
}

export interface CreateTokenInput {
    tokenId: string;
    collectionId: string;
    name: string;
    metaDataIndexed: boolean;
    imageUrl?: Nullable<string>;
    attributes?: Nullable<string>;
    description?: Nullable<string>;
}

export interface UpdateTokensInput {
    tokenId: string;
    name?: Nullable<string>;
    description?: Nullable<string>;
    imageUrl?: Nullable<string>;
}

export interface DeleteTokensInput {
    id: string[];
}

export interface CreateActivityInput {
    type: OrderTypeEnum;
    owner: string;
    cursor: string;
    reverted: boolean;
    contract: string;
    tokenId: number;
    itemId: string;
    value: number;
    transactionHash: string;
    blockChainInfo: BlockChainInfoInput;
}

export interface DeleteActivityInput {
    id: string[];
}

export interface UpdateActivity {
    id: string;
    type: OrderTypeEnum;
    owner: string;
    cursor: string;
    reverted: boolean;
    itemId: string;
    value: number;
    transactionHash: string;
    blockChainInfo: BlockChainInfoInput;
}

export interface BlockChainInfo {
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    logIndex: number;
}

export interface Activity {
    id: string;
    type: string;
    owner: string;
    date: DateTime;
    lastUpdatedAt: DateTime;
    cursor: string;
    reverted: boolean;
    contract: string;
    tokenId: number;
    itemId: string;
    value: number;
    transactionHash: string;
    blockChainInfo: BlockChainInfo;
}

export interface GetAllActivities {
    items: Activity[];
    total: number;
}

export interface Collections {
    collectionId: string;
    name: string;
    slug: string;
    bannerImageUrl: string;
    externalUrl: string;
    imageUrl: string;
    twitterUserName: string;
    discordUrl: string;
    description: string;
    tokens?: Nullable<Tokens[]>;
}

export interface Tokens {
    tokenId: string;
    name: string;
    metaDataIndexed: boolean;
    imageUrl: string;
    attributes: string;
    description: string;
}

export interface GetAllTokens {
    items: Tokens[];
    total: number;
}

export interface GetAllCollections {
    items: Collections[];
    total: number;
}

export interface IQuery {
    GetAllCollections(filterCollectionDto: FilterDto): GetAllCollections | Promise<GetAllCollections>;
    ShowCollectionById(collectionId: string): Collections | Promise<Collections>;
    GetAllTokens(searchToken: FilterTokenDto): GetAllTokens | Promise<GetAllTokens>;
    ShowTokenById(tokenId: string): Tokens | Promise<Tokens>;
    GetActivityById(activityId: string): Activity | Promise<Activity>;
    GetAllActivities(GetAllActivities: FilterActivityDto): GetAllActivities | Promise<GetAllActivities>;
}

export interface IMutation {
    CreateCollection(createCollection: CreateCollectionsInput): Collections | Promise<Collections>;
    UpdateCollectionAttribute(updateCollectionsInput: UpdateCollectionsInput): Collections | Promise<Collections>;
    DeleteCollections(DeleteCollectionInput: DeleteCollectionsInput): Nullable<Collections> | Promise<Nullable<Collections>>;
    CreateToken(CreateTokensInput: CreateTokenInput): Tokens | Promise<Tokens>;
    UpdateTokenAttribute(UpdateTokensInput: UpdateTokensInput): Tokens | Promise<Tokens>;
    DeleteToken(DeleteTokenInput: DeleteTokensInput): Nullable<Tokens> | Promise<Nullable<Tokens>>;
    CreateActivity(CreateActivityInput: CreateActivityInput): Activity | Promise<Activity>;
    DeleteActivity(DeleteActivityInput: DeleteActivityInput): Activity | Promise<Activity>;
    UpdateActivityAttribute(UpdateActivityInput: UpdateActivity): Activity | Promise<Activity>;
}

export type DateTime = any;
type Nullable<T> = T | null;
