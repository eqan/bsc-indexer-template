import { Field, ObjectType } from '@nestjs/graphql';
import { CustomBigNumberScalar } from 'src/core/customScalars/bignumber';

@ObjectType('NftTokenId')
export class NftTokenId {
  @Field(() => CustomBigNumberScalar)
  tokenId: string;
}
