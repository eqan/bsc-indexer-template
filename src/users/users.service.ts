import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { SystemErrors } from 'src/constants/errors.enum';
import { returnMessage } from 'src/constants/signermessage.const';
import { FilterUserDto } from 'src/users/dto/filter.users.dto';
import { In, Repository } from 'typeorm';
import { CreateUserOnLoginInput } from './dto/create-onLogin.input';
import { CreateUserInput } from './dto/create-user.input';
import { GetAllUsers } from './dto/get-all-users.dto';
import { LoginUserInput } from './dto/logged-user.input';
import { UpdateUserOnLoginInput } from './dto/update-onlogin.input';
import { UpdateUsersInput } from './dto/update-user.input';
import { Users } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepo: Repository<Users>,
    private authService: AuthService,
  ) {}

  /**
   * Create User
   * @params createUser
   * @return Users
   */
  async createUser(
    createUserInput: CreateUserInput | CreateUserOnLoginInput,
  ): Promise<Users> {
    try {
      const user = this.usersRepo.create(createUserInput);
      return await this.usersRepo.save(user);
    } catch (error) {
      console.log(error);
      throw SystemErrors.CREATE_USER;
    }
  }

  /**
   * Create User On Login
   * @params createUserOnLoginInput
   * @return Users
   */
  async createUserOnLogin(
    createUserInput: CreateUserOnLoginInput,
  ): Promise<Users> {
    try {
      const user = this.usersRepo.create(createUserInput);
      return await this.usersRepo.save(user);
    } catch (error) {
      console.log(error);
      throw SystemErrors.CREATE_USER_ON_LOGIN;
    }
  }

  /**
   * Get Data By User Address
   * @param userId
   * @returns userData
   */
  async getDataByuserId(userId: string): Promise<Users> {
    try {
      const userData = await this.usersRepo.findOneByOrFail({ userId });
      if (!userData) {
        throw new NotFoundException('No Users Found');
      }
      return userData;
    } catch (error) {
      console.log(error);
      throw SystemErrors.GET_USER_DATA_BY_ID;
      // throw new BadRequestException(error);
    }
  }

  /**
   * Login User and update user signature and message if required
   * @param LoggedUserInput: message, signature, address
   * @returns access token
   */
  async loginUser(
    loginUserInput: LoginUserInput,
  ): Promise<{ access_token: string }> {
    loginUserInput.userMessage = returnMessage(loginUserInput.userMessage);
    console.log(loginUserInput.userMessage);
    const user = await this.authService.validateUser(
      loginUserInput.userMessage,
      loginUserInput.userSignature,
      loginUserInput.userId,
    );

    if (!user) {
      throw new UnauthorizedException(SystemErrors.LOGIN_AUTHORIZATION);
    }
    let availableUser = null;
    try {
      availableUser = await this.usersRepo.findOneBy({ userId: user });
      if (availableUser) {
        await this.updateUserOnLogin(loginUserInput);
      } else {
        availableUser = await this.createUserOnLogin(loginUserInput);
      }
    } catch (error) {
      console.log(error);
      throw SystemErrors.LOGIN_USER_CREATION_OR_UPDATION;
      // return error;
    }
    console.log(availableUser, 'availableUser');

    return this.authService.generateUserAccessToken(
      loginUserInput.userMessage,
      loginUserInput.userSignature,
      user,
    );
  }

  /**
   * Update User On Login such as signature
   * @param updateUsersOnLoginInput
   * @returns updated user
   */
  async updateUserOnLogin(
    updateUsersInput: UpdateUserOnLoginInput,
  ): Promise<Users> {
    try {
      const { userId, userSignature } = updateUsersInput;
      await this.usersRepo.update({ userId }, { userSignature });
      return this.getDataByuserId(userId);
    } catch (error) {
      console.log(error);
      throw SystemErrors.UPDATE_USER;
      // throw new BadRequestException(error);
    }
  }

  /**
   * Update Users Attributes
   * @param updateUsersInput
   * @returns updated user
   */
  async updateUsersAttribute(
    updateUsersInput: UpdateUsersInput,
  ): Promise<Users> {
    try {
      const { userId, ...rest } = updateUsersInput;

      await this.usersRepo.update({ userId }, rest);
      return this.getDataByuserId(userId);
    } catch (error) {
      console.log(error);
      throw SystemErrors.UPDATE_USER;
      // throw new BadRequestException(error);
    }
  }

  /**
   * DELETE Users
   * @param deleteUsers
   * @returns Message that user successfully deleted
   */
  async deleteUsers(deleteWithIds: { id: string[] }): Promise<void> {
    try {
      const ids = deleteWithIds.id;
      await this.usersRepo.delete({ userId: In(ids) });
      return null;
    } catch (error) {
      console.log(error);
      throw SystemErrors.DELETE_USER;
      // throw new BadRequestException(error);
    }
  }

  /**
   * Get All Users ... With Filters
   * @@params No Params
   * @returns Array of Users and Total Number of Users
   */
  async findAllUsers(filterDto: FilterUserDto): Promise<GetAllUsers> {
    try {
      const { page, limit, ...rest } = filterDto;
      const [items, total] = await Promise.all([
        this.usersRepo.find({
          where: {
            userId: rest?.userId,
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.usersRepo.count({
          where: {
            userId: rest.userId,
          },
        }),
      ]);
      return { items, total };
    } catch (error) {
      console.log(error);
      throw SystemErrors.FIND_USERS;
      // throw new BadRequestException(err);
    }
  }
}
