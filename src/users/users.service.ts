import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { Users } from './entities/users.entity';

@Injectable()
export class UsersService {
    constructor(
      @InjectRepository(Users)
      private usersRepo: Repository<Users>,
    ) {}

    /**
     * Create Activity
     * @params createActivityinput
     * @return activity
     */
    async createUser(createUserInput: CreateUserInput): Promise<Users> {
      try {
          const user = this.usersRepo.create(createUserInput);
          return await this.usersRepo.save(Users);
      } catch (error) {
        throw new BadRequestException(error);
      }
    }

}

