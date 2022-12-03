import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType('CreatorRoyaltyInput')
@ObjectType('CreatorRoyalty')
export class CreatorRoyalty {
  @IsOptional()
  @Field(() => [String], { nullable: true, defaultValue: null })
  account?: string[];

  @IsOptional()
  @Field(() => Int, { nullable: true })
  value?: number;
}
