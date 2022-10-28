import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { SellTypeDto } from './sell.type.json.dto';

@ObjectType('Sell')
@InputType('SellInput')
export class Sell {
  @ValidateNested()
  @Type(() => SellTypeDto)
  @Field(() => SellTypeDto)
  type: SellTypeDto;

  @IsNotEmpty()
  @Field()
  value: number;
}
