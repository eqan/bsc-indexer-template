import { CreateUsdPriceInput } from './create-usd-price.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { text } from 'stream/consumers';

@InputType()
export class UpdateUsdPriceInput extends PartialType(CreateUsdPriceInput) {
  @Field(() => String)
  id: string;

  @Field({ nullable: true })
  currency: string;

  @Field()
  value: string;

  @Field()
  timestamp: number;
}
