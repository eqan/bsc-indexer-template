import { registerEnumType } from '@nestjs/graphql';

export enum UserTypes {
  ADMIN = 'ADMIN',
  REGULARUSER = 'REGULARUSER',
}
registerEnumType(UserTypes, {
  name: 'UserTypeEnum',
});
