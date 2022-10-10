import { CreateCollectionssInput } from './create-collectionss.input';
import { InputType, OmitType } from '@nestjs/graphql';

@InputType()
export class UpdateCollectionssInput extends OmitType(CreateCollectionssInput, [
  'name',
  'slug',
] as const) {}
