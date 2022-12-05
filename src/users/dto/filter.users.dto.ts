import { Field, InputType } from '@nestjs/graphql';
import { IsEthereumAddress, IsOptional } from 'class-validator';
import { PaginationParam } from './pagination.dto';

@InputType()
export class FilterUserDto extends PaginationParam {
  @IsOptional()
  @IsEthereumAddress()
  @Field({ nullable: true })
  id?: string;
}
