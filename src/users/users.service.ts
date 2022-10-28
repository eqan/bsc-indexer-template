import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { FilterUserDto } from 'src/users/dto/filter.users.dto';
import { In, Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { GetAllUsers } from './dto/get-all-users.dto';
import { LoginUserInput } from './dto/logged-user.input';
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
    async createUser(createUserInput: CreateUserInput): Promise<Users> {
      try {
          const signerAddress = await this.authService.validateUser(createUserInput.userMessage, createUserInput.userSignature, createUserInput.userAddress);
          if(signerAddress)
          {
            delete createUserInput.userMessage;
            const user = this.usersRepo.create(createUserInput);
            try
            {
              return await this.usersRepo.save(user);
            }
            catch(error)
            {
              if(error.code === '23505')
              {
                throw new ConflictException("User already exists");
              }
              else
              {
                throw new InternalServerErrorException();
              }
            }
          }
          else
          {
            throw new UnauthorizedException("User not verified!");
          }
      } catch (error) {
        throw new BadRequestException(error);
      }
    }

    /**
     * Get Data By User Address
     * @param userAddress
     * @returns userData
     */
    async getDataByUserAddress(userAddress: string): Promise<Users> {
      try {
        const userData = await this.usersRepo.findOneByOrFail({ userAddress });
        if (!userData) {
          throw new NotFoundException('No Users Found');
        }
        return userData;
      } catch (error) {
        throw new BadRequestException(error);
      }
    }
  
    /**
     * Get Data By User Address
     * @param userAddress
     * @returns userData
     */
    async getUserDataById(userAddress: string): Promise<Users> {
      try {
        const userData = this.usersRepo.findOneByOrFail({ userAddress });
        if (!userData) {
          throw new NotFoundException('No Users Found');
        }
        return userData;
      } catch (error) {
        throw new BadRequestException(error);
      }
    }
  
  /**
   * Login User
   * @param LoggedUserInput: message, signature, address
   * @returns access token
   */
    async loginUser(loginUserInput: LoginUserInput): Promise<{access_token: String}>{
      const user = await this.authService.validateUser(
        loginUserInput.userMessage,
        loginUserInput.userSignature,
        loginUserInput.userAddress,
      );
      console.log(user);
      if (!user) {
        throw new UnauthorizedException(`Email or password are invalid`);
      } else {
          // return loginUserInput.userAddress;
        return this.authService.generateUserAccessToken(loginUserInput.userMessage, loginUserInput.userSignature, user);
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
      const { userAddress, ...rest } = updateUsersInput;
      await this.usersRepo.update({ userAddress }, rest);
      return this.getDataByUserAddress(userAddress);
    } catch (error) {
      throw new BadRequestException(error);
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
      throw new BadRequestException(error);
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
            userAddress: rest?.userAddress
          },
          skip: (page - 1) * limit || 0,
          take: limit || 10,
        }),
        this.usersRepo.count({
          where: {
            userAddress: rest.userAddress
          },
        }),
      ]);
      return { items, total };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
