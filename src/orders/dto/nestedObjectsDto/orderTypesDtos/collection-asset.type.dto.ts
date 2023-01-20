import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';

@ObjectType()
@InputType('CollectionAssetType')
export class CollectionAssetType {
  @IsEthereumAddress()
  @Field()
  contract?: string;
}
