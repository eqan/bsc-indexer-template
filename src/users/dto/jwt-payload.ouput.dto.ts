import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class Payload {
  @IsNotEmpty()
  @IsString()
  @Field()
  access_token: string;
}
