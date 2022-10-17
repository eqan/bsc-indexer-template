
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

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

export interface CreateTokensInput {
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
    GetAllCollections(): GetAllCollections | Promise<GetAllCollections>;
    ShowCollectionById(collectionId: string): Collections | Promise<Collections>;
    GetTokens(): GetAllTokens | Promise<GetAllTokens>;
    ShowTokenById(tokenId: string): Tokens | Promise<Tokens>;
}

export interface IMutation {
    CreateCollection(createCollection: CreateCollectionsInput): Collections | Promise<Collections>;
    UpdateCollectionAttribute(updateCollectionsInput: UpdateCollectionsInput): Collections | Promise<Collections>;
    DeleteCollections(DeleteCollectionInput: DeleteCollectionsInput): Nullable<Collections> | Promise<Nullable<Collections>>;
    CreateToken(createTokenInput: CreateTokensInput): Tokens | Promise<Tokens>;
    UpdateTokenAttribute(UpdateTokensInput: UpdateTokensInput): Tokens | Promise<Tokens>;
    DeleteToken(DeleteTokenInput: DeleteTokensInput): Nullable<Tokens> | Promise<Nullable<Tokens>>;
}

type Nullable<T> = T | null;
