import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

@InputType('UpdateTokensInput')
export class UpdateTokensInput {
  @IsNotEmpty({ message: 'Token Contract cannot be null' })
  @Field()
  tokenId!: string;

  @Field({ nullable: true })
  name?: string;

  @Field({
    nullable: true,
  })
  description?: string;

  @IsString()
  @IsUrl({ message: 'Image URL must be a valid URL' })
  @Field({
    nullable: true,
  })
  imageUrl?: string;
}
