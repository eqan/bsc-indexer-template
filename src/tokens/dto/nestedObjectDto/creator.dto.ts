import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsEthereumAddress, IsOptional } from 'class-validator';

@InputType('CreatorRoyaltyInput')
@ObjectType('CreatorRoyalty')
export class Creator {
  @IsOptional()
  @Field(() => [String], { nullable: true, defaultValue: [] })
  account?: string[];

  @IsOptional()
  @Field(() => Int, { nullable: true })
  value?: number;
}
