import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';

@ObjectType()
@InputType('GenerativeArtAssetType')
export class GenerativeArtAssetType {
  @IsEthereumAddress()
  @Field()
  contract?: string;
}
