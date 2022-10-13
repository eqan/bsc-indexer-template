import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmpty, IsEthereumAddress, IsString } from 'class-validator';
import { PaginationParam } from './pagination.dto';

@InputType()
export class FilterDto extends PaginationParam  {

  @Field({nullable: true})
  // @IsEthereumAddress()
  collectionId ?: string;
  
  @Field({nullable: true})
  name?: string;
}
