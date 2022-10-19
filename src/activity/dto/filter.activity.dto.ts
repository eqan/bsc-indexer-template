import { Field, InputType } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';
import { PaginationParam } from './pagination.dto';

@InputType()
export class FilterActivityDto extends PaginationParam {
  @IsEthereumAddress()
  @Field({ nullable: true, defaultValue: undefined })
  continuation?: string;

  @IsEthereumAddress()
  @Field({ nullable: true, defaultValue: undefined })
  cursor?: string;
}