import { Field, ObjectType } from '@nestjs/graphql';
import { Collections } from 'src/collections/entities/collections.entity';
import { Tokens } from 'src/tokens/entities/tokens.entity';

@ObjectType('ReturnRefreshMeta')
export class ReturnRefreshMeta {
  @Field(() => Collections)
  collection: Collections;

  @Field(() => Tokens)
  token: Tokens;
}
