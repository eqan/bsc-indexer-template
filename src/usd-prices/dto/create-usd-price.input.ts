import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUsdPriceInput {
  // @Field(() => Int, { description: 'Example field (placeholder)' })
  // exampleField: number;
  @Field({ nullable: true })
  currency: string;

  @Field()
  value: string;

  @Field()
  timestamp: number;
}
