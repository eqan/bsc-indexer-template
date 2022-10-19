import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsEthereumAddress, IsOptional } from 'class-validator';
import { Activity } from '../entities/activity.entity';
import { PaginationParam } from './pagination.dto';

@InputType()
export class FilterActivityDto extends PaginationParam {
  @IsOptional()
  @IsEthereumAddress()
  @Field({ nullable: true, defaultValue: undefined })
  continuation?: string;

  @IsOptional()
  @IsEthereumAddress()
  @Field({ nullable: true, defaultValue: undefined })
  cursor?: string;
  
  @IsArray()
  @Field()
  activities: Activity[]
}