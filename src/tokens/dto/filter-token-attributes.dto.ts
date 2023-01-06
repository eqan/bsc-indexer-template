import { Field, InputType } from '@nestjs/graphql';
import { IsEthereumAddress, IsOptional, IsString } from 'class-validator';

@InputType()
export class FilterTokenAttributesDto {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  tokenId?: string;

  @IsOptional()
  @IsEthereumAddress()
  @Field({ nullable: true })
  collectionId?: string;
}
