import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';

@ObjectType()
@InputType('CollectionAssetDto')
export class CollectionAssetDto {
  @IsEthereumAddress()
  @Field()
  contract?: string;
}
