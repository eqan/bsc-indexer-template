import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsEthereumAddress, IsNotEmpty, IsString } from 'class-validator';

@InputType('CreateStatsInput')
export class CreateStatsInput {
  @IsEthereumAddress()
  @Field(() => String)
  id: string;

  @IsString()
  @Field(() => Float, { nullable: true })
  dayVolume: number;

  @IsString()
  @Field(() => Float, { nullable: true })
  floorPrice: number;

  @IsString()
  @Field(() => Float, { nullable: true })
  averagePrice: number;

  @IsString()
  @Field(() => Int, { nullable: true })
  uniqueOwners: number;
}
