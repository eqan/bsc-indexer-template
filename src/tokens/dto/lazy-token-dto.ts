import { Field, InputType } from '@nestjs/graphql';
import { BigNumber } from '@rarible/utils';
import { Transform, Type } from 'class-transformer';
import { IsEthereumAddress, ValidateNested } from 'class-validator';
import { CustomBigNumberScalar } from 'src/core/customScalars/bignumber';

import { PartDto } from 'src/core/dto/part.dto';

/**Create tokens table in database
 *
 */
@InputType()
export class LazyErc721Input {
  @Field(() => String, { nullable: true, defaultValue: 'ERC721' })
  type?: string;

  @Field(() => String)
  tokenId: string;

  @IsEthereumAddress()
  @Field(() => String)
  @Transform(({ value }) => value.toLowerCase())
  contract: string;

  @Field(() => String)
  uri: string;

  @ValidateNested()
  //   @Type(() => PartDto[])
  @Field(() => [PartDto])
  creators: PartDto[];

  @ValidateNested()
  //   @Type(() => [PartDto])
  @Field(() => [PartDto])
  royalties: PartDto[];

  @Field(() => [String])
  signatures: string[];
}

@InputType()
export class LazyErc1155Input {
  @Field(() => String, { nullable: true, defaultValue: 'ERC1155' })
  type?: string;

  @Field(() => String)
  tokenId: string;

  @IsEthereumAddress()
  @Field(() => String)
  contract: string;

  @Field(() => String)
  uri: string;

  @ValidateNested()
  //   @Type(() => PartDto[])
  @Field(() => [PartDto])
  creators: PartDto[];

  @ValidateNested()
  // @Type(() => PartDto[])
  @Field(() => [PartDto])
  royalties: PartDto[];

  @Field(() => [String])
  signatures: string[];

  @Field(() => CustomBigNumberScalar)
  supply: BigNumber;
}

@InputType()
export class LazyTokenInput {
  @ValidateNested()
  @Type(() => LazyErc721Input)
  @Field(() => LazyErc721Input, { nullable: true })
  erc721?: LazyErc721Input;

  @ValidateNested()
  @Type(() => LazyErc1155Input)
  @Field(() => LazyErc1155Input, { nullable: true })
  erc1155?: LazyErc1155Input;
}
