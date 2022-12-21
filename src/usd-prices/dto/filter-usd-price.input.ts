import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FilterUsdPriceInput {
  @Field({ nullable: true })
  currency: string;

  @Field()
  timestamp: number;
}
