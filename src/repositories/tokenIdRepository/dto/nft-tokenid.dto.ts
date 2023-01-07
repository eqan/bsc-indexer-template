import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('NftTokenId')
export class NftTokenId {
  @Field()
  tokenId: string;
}
