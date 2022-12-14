import {
  BadRequestException,
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
  async create(
    createUserInput: CreateUserInput | CreateUserOnLoginInput,
  ): Promise<Users> {
    try {
      const user = this.usersRepo.create(createUserInput);
      return await this.usersRepo.save(user);
    } catch (error) {
      throw new BadRequestException(SystemErrors.CREATE_USER);
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
      throw new BadRequestException(SystemErrors.CREATE_USER_ON_LOGIN);
    }
  }

  /**
   * Get Data By User Address
   * @param id
   * @returns userData
   */
  async show(id: string): Promise<Users> {
    try {
      const userData = await this.usersRepo.findOneByOrFail({ id });
      if (!userData) {
        throw new NotFoundException('No Users Found');
      }
      return userData;
    } catch (error) {
      throw new BadRequestException(SystemErrors.GET_USER_DATA_BY_ID);
    }
  }
  /*
    Checks if
    User available -> Updates the information of the available user such user signature, user message etc.
    User not available -> Creates the user.
  */
  async modifyUserOnLogin(availableUser: any, loginUserInput: LoginUserInput) {
    if (availableUser) {
      await this.updateUserOnLogin(loginUserInput);
    } else {
      availableUser = await this.createUserOnLogin(loginUserInput);
    }
    return availableUser;
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
    let availableUser = null;
    const user = await this.authService.validateUser(
      loginUserInput.userMessage,
      loginUserInput.userSignature,
      loginUserInput.id,
    );

    if (user) {
      try {
        availableUser = await this.usersRepo.findOneBy({ id: user });
        availableUser = this.modifyUserOnLogin(availableUser, loginUserInput);
      } catch (error) {
        throw new BadRequestException(
          SystemErrors.LOGIN_USER_CREATION_OR_UPDATION,
        );
      }
    } else throw new UnauthorizedException(SystemErrors.LOGIN_AUTHORIZATION);

    return this.authService.generateUserAccessToken(
      loginUserInput.userMessage,
      loginUserInput.userSignature,
      availableUser,
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
      const { id, userSignature } = updateUsersInput;
      await this.usersRepo.update({ id }, { userSignature });
      return this.show(id);
    } catch (error) {
      throw new BadRequestException(SystemErrors.UPDATE_USER);
    }
  }

  /**
   * Update Users Attributes
   * @param updateUsersInput
   * @returns updated user
   */
  async update(updateUsersInput: UpdateUsersInput): Promise<Users> {
    try {
      const { id, ...rest } = updateUsersInput;
      await this.usersRepo.update({ id }, rest);
      return this.show(id);
    } catch (error) {
      throw new BadRequestException(SystemErrors.UPDATE_USER);
    }
  }

  /**
   * DELETE Users
   * @param deleteUsers
   * @returns Message that user successfully deleted
   */
  async delete(deleteWithIds: { id: string[] }): Promise<void> {
    try {
      const ids = deleteWithIds.id;
      await this.usersRepo.delete({ id: In(ids) });
    } catch (error) {
      console.log(error);
      throw new BadRequestException(SystemErrors.DELETE_USER);
    }
  }

  /**
   * Get All Users ... With Filters
   * @@params No Params
   * @returns Array of Users and Total Number of Users
   */
  async index(filterDto: FilterUserDto): Promise<GetAllUsers> {
    try {
      const { page = 1, limit = 20, ...rest } = filterDto;
      const [items, total] = await Promise.all([
        this.usersRepo.find({
          where: {
            id: rest?.id,
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.usersRepo.count({
          where: {
            id: rest?.id,
          },
        }),
      ]);
      return { items, total };
    } catch (error) {
      throw new BadRequestException(SystemErrors.FIND_USERS);
    }
  }
}
