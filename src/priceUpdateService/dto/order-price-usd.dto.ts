import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderTransaction } from 'src/orders/entities/enums/order.transaction-type.enum';

@InputType('OrderFormDto')
export class OrderTransactionAsset {
  @IsOptional()
  @Field(() => Number, { nullable: true })
  usdValue?: number;

  @IsOptional()
  @Field(() => Number)
  takePriceUsd: number;

  @IsOptional()
  @Field(() => Number)
  makePriceUsd: number;

  @IsOptional()
  @IsEnum(OrderTransaction)
  @Field(() => OrderTransaction)
  type?: OrderTransaction;
}
