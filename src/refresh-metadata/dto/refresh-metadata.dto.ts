import { Field, InputType } from '@nestjs/graphql';
import { IsEthereumAddress, IsNotEmpty } from 'class-validator';

@InputType('RefreshMetadataInput')
export class RefreshMetadatInput {
  @IsNotEmpty()
  @IsEthereumAddress()
  @Field(() => String)
  collectionId: string;

  @IsNotEmpty()
  @Field(() => String)
  tokenId: string;
}
