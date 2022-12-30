import { registerEnumType } from '@nestjs/graphql';

export enum SortOrder {
  ASC_ORDER = 'ASC',
  DESC_ORDER = 'DESC',
}

registerEnumType(SortOrder, {
  name: 'SortOrder',
});
