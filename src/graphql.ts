
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface DataOrginFeeInput {
    account: string;
    value: number;
}

export interface DataInput {
    type: string;
    originFees: DataOrginFeeInput;
}

export interface MakeTypeInput {
    type: string;
    contract: string;
    tokenId: number;
}

export interface MakeInput {
    value: number;
    type: MakeTypeInput;
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

export interface FilterOrderDto {
    page?: Nullable<number>;
    limit?: Nullable<number>;
    orderId?: Nullable<string>;
    maker?: Nullable<string>;
    taker?: Nullable<string>;
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

export interface CreateOrdersInput {
    orderId: string;
    fill: number;
    status: string;
    makeStock: number;
    cancelled: boolean;
    createdAt: DateTime;
    lastUpdatedAt: DateTime;
    maker: string;
    Make: MakeInput;
    take: MakeInput;
    salt: string;
    data: DataInput;
    startedAt: DateTime;
    endedAt: DateTime;
    optionalRoyalties: boolean;
    dbUpdatedAt: DateTime;
    makePrice: number;
    takePrice: number;
    makePriceUsed: number;
    takePriceUsed: number;
    signature: string;
    taker?: Nullable<string>;
}

export interface DeleteOrderInput {
    id: string[];
}

export interface UpdateOrderStatus {
    orderId: string;
    status: string;
}

export interface Tokens {
    tokenId: string;
    name: string;
    metaDataIndexed: boolean;
    imageUrl: string;
    attributes: string;
    description: string;
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
}

export interface GetAllCollections {
    items: Collections[];
    total: number;
}

export interface DataOriginFee {
    account: string;
    value: number;
}

export interface Data {
    type: string;
    originFees: DataOriginFee;
}

export interface MakeType {
    type: string;
    contract: string;
    tokenId: number;
}

export interface Make {
    value: number;
    type: MakeType;
}

export interface Orders {
    orderId: string;
    fill: number;
    status: string;
    makeStock: number;
    cancelled: boolean;
    createdAt: DateTime;
    lastUpdatedAt: DateTime;
    maker: string;
    Make: Make;
    take: Make;
    salt: string;
    data: Data;
    startedAt: DateTime;
    endedAt: DateTime;
    optionalRoyalties: boolean;
    dbUpdatedAt: DateTime;
    makePrice: number;
    takePrice: number;
    makePriceUsed: number;
    takePriceUsed: number;
    signature: string;
    taker: string;
}

export interface GetAllTokens {
    items: Tokens[];
    total: number;
}

export interface GetAllOrders {
    items: Orders[];
    total: number;
}

export interface IQuery {
    GetAllCollections(filterCollectionDto: FilterDto): GetAllCollections | Promise<GetAllCollections>;
    ShowCollectionById(collectionId: string): Collections | Promise<Collections>;
    GetAllTokens(searchToken: FilterTokenDto): GetAllTokens | Promise<GetAllTokens>;
    ShowTokenById(tokenId: string): Tokens | Promise<Tokens>;
    GetOrderById(orderId: string): Orders | Promise<Orders>;
    GetAllOrders(GetAllOrders: FilterOrderDto): GetAllOrders | Promise<GetAllOrders>;
}

export interface IMutation {
    CreateCollection(createCollection: CreateCollectionsInput): Collections | Promise<Collections>;
    UpdateCollectionAttribute(updateCollectionsInput: UpdateCollectionsInput): Collections | Promise<Collections>;
    DeleteCollections(DeleteCollectionInput: DeleteCollectionsInput): Nullable<Collections> | Promise<Nullable<Collections>>;
    CreateToken(CreateTokensInput: CreateTokenInput): Tokens | Promise<Tokens>;
    UpdateTokenAttribute(UpdateTokensInput: UpdateTokensInput): Tokens | Promise<Tokens>;
    DeleteToken(DeleteTokenInput: DeleteTokensInput): Nullable<Tokens> | Promise<Nullable<Tokens>>;
    CreateOrder(CreateOrderInput: CreateOrdersInput): Orders | Promise<Orders>;
    DeleteOrder(Delete: DeleteOrderInput): Orders | Promise<Orders>;
    UpdateOrderStatus(UpdateOrderStatus: UpdateOrderStatus): Orders | Promise<Orders>;
}

export type DateTime = any;
type Nullable<T> = T | null;
