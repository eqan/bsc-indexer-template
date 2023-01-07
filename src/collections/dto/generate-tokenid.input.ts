import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType('GenerateTokenIdInput')
export class GenerateTokenIdInput {
  @IsNotEmpty({ message: 'collectionId cannot be null' })
  @IsString({ message: 'collectionId must be a String' })
  @Field()
  collectionId: string;

  @IsNotEmpty({ message: 'minter cannot be null' })
  @IsString({ message: 'minter must be a String' })
  @Field()
  minter: string;
}
