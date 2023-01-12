import { Field, InputType } from '@nestjs/graphql';
import { IsEthereumAddress, IsOptional, IsString } from 'class-validator';
import { PaginationParam } from './pagination.dto';

@InputType()
export class FilterTokenDto extends PaginationParam {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  id?: string;

  @IsOptional()
  @IsEthereumAddress()
  @Field({ nullable: true })
  contract?: string;

  @IsOptional()
  @IsEthereumAddress()
  @Field({ nullable: true })
  owner?: string;
}
