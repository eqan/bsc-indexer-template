import { Field, InputType } from '@nestjs/graphql';
import { IsEthereumAddress, IsOptional, IsString } from 'class-validator';
import { PaginationParam } from './pagination.dto';

@InputType()
export class FilterOrderDto extends PaginationParam {
  @IsOptional()
  @IsEthereumAddress({ message: 'Order ID should be an ethereum address' })
  @Field({ nullable: true, defaultValue: undefined })
  orderId?: string;

  @IsEthereumAddress()
  @IsOptional()
  @Field({ nullable: true, defaultValue: undefined })
  maker?: string;

  @IsEthereumAddress()
  @IsOptional()
  @Field({ nullable: true, defaultValue: undefined })
  taker?: string;
}
