import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ObjectType('GetOwners')
export class GetOwners {
  @IsOptional()
  @Field(() => [String], { nullable: true })
  owners: string[];

  @IsOptional()
  @Field(() => String, { nullable: true })
  owner: string;
}
