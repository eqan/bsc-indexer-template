import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { CollectionType } from '../entities/enum/collection.type.enum';
import { CollectionMeta } from './nestedObjects/collections.meta.dto';

@InputType('CreateCollectionsInput')
export class CreateCollectionsInput {
  @IsNotEmpty({ message: 'Id cannot be null' })
  @IsEthereumAddress({ message: 'Collection ID Must be a Ethereum Address' })
  @Field()
  id: string;

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
  @Field()
  owner: string;

  @IsOptional()
  @IsString({ message: 'Twitter Url Name must be String' })
  @Field({
    nullable: true,
  })
  twitterUrl: string;

  @IsOptional()
  @IsUrl({ message: 'Discord URL must be a valid URL' })
  @Field({
    nullable: true,
  })
  discordUrl: string;

  @IsOptional()
  @Field({
    nullable: true,
  })
  description: string;

  @ValidateNested()
  @Type(() => CollectionMeta)
  @Field(() => CollectionMeta, { nullable: true })
  Meta?: CollectionMeta;
}
