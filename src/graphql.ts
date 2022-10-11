
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateTokensInput {
    tokenContract: string;
    tokenId: string;
    name: string;
    collectionId: string;
    metaDataIndexed: boolean;
    imageUrl?: Nullable<string>;
    attributes?: Nullable<string>;
    description?: Nullable<string>;
}

export interface UpdateTokensInput {
    tokenContract: string;
    name?: Nullable<string>;
    tokenId?: Nullable<string>;
    collectionId?: Nullable<string>;
    description?: Nullable<string>;
    imageUrl?: Nullable<string>;
}

export interface DeleteTokensInput {
    id: string[];
}

export interface Tokens {
    tokenContract: string;
    name: string;
    tokenId: string;
    collectionId: string;
    metaDataIndexed: boolean;
    imageUrl: string;
    attributes: string;
    description: string;
}

export interface IQuery {
    index(): Tokens[][] | Promise<Tokens[][]>;
    showTokenById(tokenId: string): Tokens | Promise<Tokens>;
}

export interface IMutation {
    createToken(createTokenInput: CreateTokensInput): Tokens | Promise<Tokens>;
    updateTokenAttribute(updateTokensInput: UpdateTokensInput): Tokens | Promise<Tokens>;
    delete(deleteTokenInput: DeleteTokensInput): Nullable<Tokens> | Promise<Nullable<Tokens>>;
}

type Nullable<T> = T | null;
