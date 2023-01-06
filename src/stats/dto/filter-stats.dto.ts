import { Field, InputType } from '@nestjs/graphql';
import { IsEthereumAddress, IsOptional, IsString } from 'class-validator';
import { PaginationParam } from './pagination.dto';
@InputType()
export class FilterStatsDto extends PaginationParam {
  @IsEthereumAddress()
  @Field(() => String)
  id: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  dayVolume: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  floorPrice: string;
}
