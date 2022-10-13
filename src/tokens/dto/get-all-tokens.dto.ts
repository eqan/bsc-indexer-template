import { Field, ObjectType } from '@nestjs/graphql';
import { Tokens } from '../entities/tokens.entity';

@ObjectType('GetAllTokens')
export class GetAllTokens {
  @Field(() => [Tokens])
  items: Tokens[];

  @Field()
  total: number;
}
