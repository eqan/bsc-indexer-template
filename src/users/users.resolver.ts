import { BadRequestException, Query } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import BaseProvider from 'src/core/base.BaseProvider';
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/logged-user.input';
import { LoggedUserOutput } from './dto/logged-user.output';
import { Users } from './entities/users.entity';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver extends BaseProvider<Users> {
    constructor(private readonly userService: UsersService) {
        super();
    }

  /**
   * Login User
   * @param LoggedUserInput: message, signature, address
   * @returns access token
   */
    @Mutation(() => LoggedUserOutput)
    loginUser(@Args('loginUserInput') loginUserInput: LoginUserInput) {
      return this.userService.loginUser(loginUserInput);
    }

  /**
   * Create User
   * @param createUsersInput
   * @returns Users
   */
  @Mutation(() => Users, { name: 'CreateUser' })
  async create(
    @Args('CreateUserInput') createUsersInput: CreateUserInput,
  ): Promise<Users> {
    try {
      return await this.userService.createUser(createUsersInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Delete User
   * @param deleteUserInput
   * @returns void
   */
  @Mutation(() => Users, { name: 'DeleteUser' })
  async delete(
    @Args('Delete') deleteUserInput: DeleteUserInput,
  ): Promise<void> {
    try {
      return await this.userService.deleteUser(deleteUserInput);
    } catch (error) {}
  }

  /**
   * Update User Status
   * @param updateUserStatus
   * @returns Updated User
   */
  @Mutation(() => Users, { name: 'UpdateUserStatus' })
  async edit(
    @Args('UpdateUserStatus')
    updateUserStatus: UpdateUserStatus,
  ): Promise<Users> {
    try {
      return await this.userService.updateUserStatus(updateUserStatus);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get User By address
   * @param userAddress
   * @returns User
   */
  @Query(() => Users, { name: 'GetUserDataByUserAddress' })
  async show(@Args('userAddress') userAddress: string): Promise<Users> {
    try {
      return await this.userService.getDataByUserAddress(userAddress);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get ALl Users
   * @param filterUserDto
   * @returns Searched or all users
   */
  @Query(() => GetAllUsers, { name: 'GetAllUsers' })
  async index(
    @Args('filterUserDto') filterUserDto: FilterUserDto,
  ): Promise<GetAllUsers> {
    try {
      return await this.userService.findAllUsers(filterUserDto);
    } catch (error) {}
  }
}
