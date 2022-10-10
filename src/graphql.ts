
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateCollectionssInput {
    collection_id: string;
    name: string;
    slug: string;
    bannerImageUrl?: Nullable<string>;
    externalUrl?: Nullable<string>;
    ImageUrl?: Nullable<string>;
    twitterUserName?: Nullable<string>;
    discordUrl?: Nullable<string>;
    description?: Nullable<string>;
}

export interface UpdateCollectionssInput {
    collection_id: string;
    bannerImageUrl?: Nullable<string>;
    externalUrl?: Nullable<string>;
    ImageUrl?: Nullable<string>;
    twitterUserName?: Nullable<string>;
    discordUrl?: Nullable<string>;
    description?: Nullable<string>;
}

export interface Collectionss {
    collection_id: string;
    name: string;
    slug: string;
    bannerImageUrl: string;
    externalUrl: string;
    ImageUrl: string;
    twitterUserName: string;
    discordUrl: string;
    description: string;
}

export interface IQuery {
    getAllcollectionss(): Collectionss[] | Promise<Collectionss[]>;
    getCollectionById(collection_id: string): Collectionss | Promise<Collectionss>;
}

export interface IMutation {
    createCollection(createCollection: CreateCollectionssInput): Collectionss | Promise<Collectionss>;
    updateCollectionAtribute(updateCollectionssInput: UpdateCollectionssInput): Collectionss | Promise<Collectionss>;
    deleteCollection(id: string): string | Promise<string>;
}

type Nullable<T> = T | null;
