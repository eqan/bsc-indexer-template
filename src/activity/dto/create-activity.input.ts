import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
    IsEthereumAddress,
    IsNotEmpty, ValidateNested
} from 'class-validator';
import { ActivityMetaData } from './metadatadto/activity.metadata.dto';

@InputType()
export class CreateActivityInput {
  @IsEthereumAddress({ message: 'Continuation address should be an ethereum address' })
  @Field()
  continuation: string;

  @IsEthereumAddress({ message: 'Cursor address should be an ethereum address' })
  @Field()
  cursor: number;

  @ValidateNested()
  @IsNotEmpty({ message: 'Activity Metadata cannot be null' })
  @Type(() => ActivityMetaData)
  @Field()
  activities: ActivityMetaData;
}