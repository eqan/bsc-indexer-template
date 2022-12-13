import { Field, InputType } from '@nestjs/graphql';
import { IsEthereumAddress, IsString } from 'class-validator';
import { PaginationParam } from './pagination.dto';

@InputType()
export class FilterDto extends PaginationParam {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  name?: string;
}
