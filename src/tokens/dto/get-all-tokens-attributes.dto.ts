import { Field, ObjectType } from '@nestjs/graphql';
import { TokensAttributes } from '../entities/nestedObjects/tokens.meta.attributes.entity';
import { Tokens } from '../entities/tokens.entity';

@ObjectType('GetAllTokensAttributes')
export class GetAllTokensAttributes {
  @Field(() => [Tokens])
  items: TokensAttributes[];

  @Field()
  total: number;
}
