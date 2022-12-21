import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BaseEventParamsInput } from './events.dto.base-event-params';

export class OrderCancelEventInput {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsNotEmptyObject()
  @ValidateNested()
  baseEventParams: BaseEventParamsInput;
}
