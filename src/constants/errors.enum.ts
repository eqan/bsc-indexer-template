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
  CREATE_ACTIVITY = 'E10: Unable To Create Activity',
  UPDATE_ACTIVITY = 'E11: Unable To Update Activity',
  DELETE_ACTIVITY = 'E12: Unable To Delete Activity',
  FIND_ACTIVITY = 'E13: Unable To Find All Activity',
  CREATE_AUCTION = 'E14: Unable To Create Auction',
  UPDATE_AUCTION = 'E15: Unable To Update Auction',
  DELETE_AUCTION = 'E16: Unable To Delete Auction',
  FIND_AUCTION = 'E17: Unable To Find All Auction',
  CREATE_ORDER = 'E18: Unable To Create Order',
  UPDATE_ORDER = 'E19: Unable To Update Order',
  DELETE_ORDER = 'E20: Unable To Delete Order',
  FIND_ORDER = 'E21: Unable To Find All Order',
  ACTIVITY_ALREADY_MADE = 'E22: Activity Already Made',
}

registerEnumType(SystemErrors, {
  name: 'ErrorTypesEnum',
});
