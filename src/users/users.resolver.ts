import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import BaseProvider from 'src/core/base.BaseProvider';
import { CreateUserInput } from './dto/create-user.input';
import { DeleteUsersInput } from './dto/delete-users.input';
import { FilterUserDto } from './dto/filter.users.dto';
import { GetAllUsers } from './dto/get-all-users.dto';
import { LoginUserInput } from './dto/logged-user.input';
import { LoggedUserOutput } from './dto/logged-user.output';
import { UpdateUsersInput } from './dto/update-user.input';
import { Users } from './entities/users.entity';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver extends BaseProvider<Users> {
    constructor(
      private readonly userService: UsersService,
      ) {
        super();
    }
  /**
   * Login User
   * @param LoggedUserInput: message, signature, address
   * @returns access token
   */LoggdUerOutput
    @Query(() => LoggedUserOutput, {name: "LoginUser"})
    loginUser(@Args('LoginUserInput') loginUserInput: LoginUserInput): Promise<{access_token: String}> {
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
    @Args('DeleteUserInput') deleteUserInput: DeleteUsersInput,
  ): Promise<void> {
    try {
      return await this.userService.deleteUsers(deleteUserInput);
    } catch (error) {}
  }

  /**
   * Update User Status
   * @param updateUserStatus
   * @returns Updated User
   */
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Users, { name: 'UpdateUser' })
  async edit(
    @Args('UpdateUserInput')
    updateUserStatus: UpdateUsersInput,
  ): Promise<Users> {
    try {
      return await this.userService.updateUsersAttribute(updateUserStatus);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get User By address
   * @param userAddress
   * @returns User
   */
  // @UseGuards(JwtAuthGuard)
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
  // @UseGuards(JwtAuthGuard)
  @Query(() => GetAllUsers, { name: 'GetAllUsers' })
  async index(
    @Args('filterUserDto') filterUserDto: FilterUserDto,
  ): Promise<GetAllUsers> {
    try {
      return await this.userService.findAllUsers(filterUserDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
