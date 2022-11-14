import { Field, InputType } from '@nestjs/graphql';
import { IsEthereumAddress } from 'class-validator';
import { PaginationParam } from './pagination.dto';

@InputType()
export class FilterUserDto extends PaginationParam {
  @IsEthereumAddress()
  @Field({ nullable: true, defaultValue: undefined })
  id?: string;
}
