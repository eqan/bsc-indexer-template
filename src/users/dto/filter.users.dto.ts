import { Field, InputType } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';
import { PaginationParam } from './pagination.dto';

@InputType()
export class FilterUserDto extends PaginationParam {
  @Field({ nullable: true, defaultValue: undefined })
  userId?: string;

  @IsEthereumAddress()
  @Field({ nullable: true, defaultValue: undefined })
  userAddress?: string;
}
