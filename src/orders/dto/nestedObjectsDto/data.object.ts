import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { DataOriginFee } from './data.origin-fee.dto';

@ObjectType('Data')
@InputType('DataInput')
export class Data {
  @IsString()
  @Field()
  type: string;

  @ValidateNested()
  @Type(() => DataOriginFee)
  @Field(() => DataOriginFee)
  originFees: DataOriginFee;
}
