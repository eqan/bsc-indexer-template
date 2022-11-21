import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsEthereumAddress, IsOptional } from 'class-validator';
import { ActivityType } from '../entities/enums/activity.type.enum';
import { PaginationParam } from './pagination.dto';
@InputType()
export class FilterActivityDto extends PaginationParam {
  @IsOptional()
  @IsEthereumAddress()
  @Field({ nullable: true, defaultValue: undefined })
  id?: string;

  @IsOptional()
  @IsEnum(ActivityType)
  @Field(() => ActivityType, { nullable: true, defaultValue: undefined })
  type?: ActivityType;
}
