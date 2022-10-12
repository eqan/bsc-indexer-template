
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

export interface IQuery {
    GetAllCollections(): GetAllCollections | Promise<GetAllCollections>;
    ShowCollectionById(collectionId: string): Collections | Promise<Collections>;
}

export interface IMutation {
    CreateCollection(createCollection: CreateCollectionsInput): Collections | Promise<Collections>;
    UpdateCollectionAttribute(updateCollectionsInput: UpdateCollectionsInput): Collections | Promise<Collections>;
    DeleteCollections(DeleteCollectionInput: DeleteCollectionsInput): Nullable<Collections> | Promise<Nullable<Collections>>;
}

type Nullable<T> = T | null;
