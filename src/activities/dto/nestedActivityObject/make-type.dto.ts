import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { CollectionType } from 'src/collections/entities/enum/collection.type.enum';

@ObjectType('ActivityMakeType')
@InputType('ActivityMakeTypeInput')
export class MakeType {
  @IsEnum(CollectionType)
  @Field(() => CollectionType)
  type: CollectionType;

  @IsEthereumAddress()
  @IsNotEmpty()
  @Field()
  contract: string;
}
