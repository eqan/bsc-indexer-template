import { Field, InputType } from '@nestjs/graphql';
import { Collection } from '@ts-morph/common/lib/typescript';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CollectionType } from '../entities/enum/collection.type.enum';
import { CollectionMeta } from './netsedObjects/collections.meta.dto';

@InputType('CreateCollectionsInput')
export class CreateCollectionsInput {
  @IsNotEmpty({ message: 'Id cannot be null' })
  @IsEthereumAddress({ message: 'Collection ID Must be a Ethereum Address' })
  @Field()
  collectionId: string;

  @IsString({ message: 'Name must be a String' })
  @Field()
  name: string;

  @IsEnum(CollectionType)
  @Field(() => CollectionType)
  type: CollectionType;

  @IsString()
  @Field({
    nullable: true,
  })
  parent?: string;

  @IsString()
  @Field({
    nullable: true,
  })
  symbol?: string;

  @IsEthereumAddress()
  @Field({
    nullable: true,
  })
  owner?: string;

  @ValidateNested()
  @Type(() => CollectionMeta)
  @Field(() => CollectionMeta, { nullable: true })
  meta?: CollectionMeta;
}
