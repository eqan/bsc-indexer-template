import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType('CreatorRoyaltyInput')
@ObjectType('CreatorRoyalty')
export class CreatorRoyalty {
  @IsOptional()
  @Field(() => String)
  account?: string[];

  @IsOptional()
  @Field(() => Int)
  value?: number;
}
