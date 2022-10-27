import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { MakeType } from './make-type.dto';
@ObjectType('ActivityMake')
@InputType('ActivityMakeInput')
export class Make {
  @Field(() => Int)
  value: number;

  @ValidateNested()
  @Type(() => MakeType)
  @Field(() => MakeType)
  type: MakeType;
}
