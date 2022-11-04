import { registerEnumType } from '@nestjs/graphql';

export enum SystemErrors {
  CREATE_USER = 'E01: Unable To Create User',
  CREATE_USER_ON_LOGIN = 'E02: Unable To Create User On Authentication',
  GET_USER_DATA_BY_ID = 'E03: Unable To Fetch User Data By ID',
  LOGIN_AUTHORIZATION = 'E04: Authorization and access token generation failed because of invalid data',
  LOGIN_USER_CREATION_OR_UPDATION = 'E05: Unable to create or update user on login',
  UPDATE_USER = 'E06: Unable To Update User',
  DELETE_USER = 'E07: Unable To Delete User',
  FIND_USERS = 'E08: Unable To Find All Users',
  COOKIES_NOT_FOUND = 'E09: Unable to retrieve cookies',
}

registerEnumType(SystemErrors, {
  name: 'ErrorTypesEnum',
});
