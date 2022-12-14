import {
  BadRequestException,
  Inject,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import {
  Args,
  GqlExecutionContext,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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

@Injectable()
@Resolver()
export class UsersResolver extends BaseProvider<Users> {
  constructor(
    @Inject(GqlExecutionContext)
    private readonly gqlExecutionContext: GqlExecutionContext,
    private readonly userService: UsersService,
  ) {
    super();
  }
  /**
   * Login User
   * @param LoggedUserInput: message, signature, address
   * @returns access token
   */
  @Query(() => LoggedUserOutput, { name: 'LoginUser' })
  async loginUser(
    @Args('LoginUserInput') loginUserInput: LoginUserInput,
  ): Promise<{ access_token: string }> {
    const token = this.userService.loginUser(loginUserInput);
    // res.set(
    //   'set-cookie',
    //   'access_token=my-cookie-value; Max-Age=604800; HttpOnly; Secure',
    // );
    // res.cookie('access_token', token, {
    //   maxAge: 60 * 60 * 24 * 7, // 7 days
    //   httpOnly: true,
    //   secure: true,
    // });
    // res.cookie('access_token', token);
    // Set the access token in a cookie
    // ctx.res.cookie('access_token', token);

    // Check if the response has a 'set-cookie' property
    // try {
    // Get the 'set-cookie' property from the GraphQL execution context
    const setCookie = this.gqlExecutionContext['set-cookie'];

    // Check if the 'set-cookie' property exists
    if (typeof setCookie !== 'undefined') {
      // Print the first cookie in the array
      console.log(setCookie[0]);
    }
    console.log(setCookie);
    // const ctx = this.gqlExecutionContext.getContext();
    // const res = ctx.response;
    // if (res.hasOwnProperty('set-cookie')) {
    //   // Get the 'set-cookie' property
    //   const setCookie = res['set-cookie'];

    //   // Print the first cookie in the array
    //   console.log(setCookie[0]);
    // }
    // } catch (error) {
    //   console.log(error);
    // }
    return token;
    // res.cookie('access_token', token, { httpOnly: true });
    // return token;
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
      return await this.userService.create(createUsersInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Delete User
   * @param deleteUserInput
   * @returns void
   */
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Users, { name: 'DeleteUser', nullable: true })
  async delete(
    @Args('DeleteUserInput') deleteUserInput: DeleteUsersInput,
  ): Promise<void> {
    try {
      await this.userService.delete(deleteUserInput);
    } catch (error) {
      throw new BadRequestException(error);
    }
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
      return await this.userService.update(updateUserStatus);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get User By address
   * @param id
   * @returns User
   */
  @UseGuards(JwtAuthGuard)
  @Query(() => Users, { name: 'GetUserDataByuserId' })
  async show(@Args('userId') id: string): Promise<Users> {
    try {
      return await this.userService.show(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Get ALl Users
   * @param filterUserDto
   * @returns Searched or all users
   */
  @UseGuards(JwtAuthGuard)
  @Query(() => GetAllUsers, { name: 'GetAllUsers' })
  async index(
    @Args('filterUserDto', { nullable: true, defaultValue: {} })
    filterUserDto: FilterUserDto,
  ): Promise<GetAllUsers> {
    try {
      return await this.userService.index(filterUserDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
