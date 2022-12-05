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

@InputType('UpdateCollectionsInput')
export class UpdateCollectionsInput {
  @IsNotEmpty({ message: 'Id cannot be null' })
  @IsEthereumAddress({ message: 'Collection ID Must be a Ethereum Address' })
  @Field()
  id: string;

  @IsOptional()
  @IsUrl({ message: 'Banner Image URL must be a valid URL' })
  @Field({
    nullable: true,
  })
  bannerImageUrl?: string;

  @IsOptional()
  @IsString({ message: 'Name must be a String' })
  @Field({ nullable: true })
  name?: string;

  @IsOptional()
  @IsEnum(CollectionType)
  @Field(() => CollectionType, { nullable: true })
  type?: CollectionType;

  @IsOptional()
  @IsString()
  @Field({
    nullable: true,
  })
  parent?: string;

  @IsOptional()
  @IsString()
  @Field({
    nullable: true,
  })
  symbol?: string;

  @IsOptional()
  @IsEthereumAddress()
  @Field()
  owner: string;

  @IsOptional()
  @IsUrl({ message: 'Discord URL must be a valid URL' })
  @Field({
    nullable: true,
  })
  discordUrl?: string;

  @IsOptional()
  @IsUrl({ message: 'Twitter URL must be a valid URL' })
  @Field({
    nullable: true,
  })
  twitterUrl?: string;

  @IsOptional()
  @IsString()
  @Field({
    nullable: true,
  })
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CollectionMeta)
  @Field(() => CollectionMeta, { nullable: true })
  Meta?: CollectionMeta;
}
