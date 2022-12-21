import {
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OrderSide } from '../enums/events.enums.order-side';
import { BaseEventParamsInput } from './events.dto.base-event-params';

export class OrderMatchEventInput {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  @IsEnum(OrderSide)
  orderSide: OrderSide;

  @IsEthereumAddress()
  @IsString()
  @IsNotEmpty()
  maker: string;

  @IsEthereumAddress()
  @IsString()
  @IsNotEmpty()
  taker: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsEthereumAddress()
  @IsString()
  @IsNotEmpty()
  contract: string;

  @IsString()
  @IsNotEmpty()
  tokenId: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsEthereumAddress()
  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsOptional()
  currencyPrice?: string;

  @IsString()
  @IsOptional()
  usdPrice?: string;

  @IsNotEmptyObject()
  @ValidateNested()
  baseEventParams: BaseEventParamsInput;
}
