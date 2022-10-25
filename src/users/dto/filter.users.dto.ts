import { Field, InputType } from '@nestjs/graphql';
import { IsEthereumAddress, IsOptional } from 'class-validator';
import { PaginationParam } from './pagination.dto';

@InputType()
export class FilterUserDto extends PaginationParam {
  @Field({ nullable: true, defaultValue: undefined })
  userId?: string;

  @IsEthereumAddress()
  @IsOptional()
  @Field({ nullable: true, defaultValue: undefined })
  userAddress?: string;
}
