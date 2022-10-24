import { verifyMessage } from '@ethersproject/wallet';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/logged-user.input';
import { Users } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    private usersRepo: Repository<Users>,
    private readonly authService: AuthService,
  ) {}
    
    /**
     * Verift wallet and return signer address
     * @params createActivityinput
     * @return signer address
     */
    async verifyWalletAndReturnSignerAddress(message: string,signature: string, address: string)
    {
      try {
        const signerAddr = await verifyMessage(message, signature);
        if (signerAddr !== address) {
            return false;
        }
        return signerAddr;
      } catch (error)
      {
        throw new BadRequestException(error);
      }
    }

    /**
     * Create User
     * @params createUser
     * @return Users
     */
    async createUser(createUserInput: CreateUserInput): Promise<Users> {
      try {
          // Example of data being passed
          // const data = {
          //               message: "sdkads", 
          //               signature:"0x7b5cc82554eb8361c05d70ac351cc0f7e4f2af52a27dadce634901520fff4ff16e8c13f238b69e7dc1dcabe8ddf62a9d962c9ff5da2f76d03e21edf03d1d57b41c",
          //               address: "0xe0820b992c0b1f3ab20a272e27bb4e33f6724d25"
          //              } 
          // const signerAddress = await this.verifyWalletAndReturnSignerAddress(data.message, data.signature, data.address);

          const signerAddress = await this.verifyWalletAndReturnSignerAddress(createUserInput.userMessage, createUserInput.userSignature, createUserInput.userAddress);
          if(signerAddress)
          {
            delete createUserInput.userMessage;
            const user = this.usersRepo.create(createUserInput);
            return await this.usersRepo.save(Users);
          }
      } catch (error) {
        throw new BadRequestException(error);
      }
    }

    /**
     * Get Data By User Address
     * @param userAddress
     * @returns user data
     */
    async getDataByUserAddress(userAddress: string): Promise<Users> {
      try {
        const userData = this.usersRepo.findOneByOrFail({ userAddress });
        if (!userData) {
          throw new NotFoundException('No Activity Found');
        }
        return userData;
      } catch (error) {
        throw new BadRequestException(error);
      }
    }
  
    async loginUser(loginUserInput: LoginUserInput) {
      const user = await this.authService.validateUser(
        loginUserInput.userMessage,
        loginUserInput.userSignature,
        loginUserInput.userAddress,
      );
      if (!user) {
        throw new BadRequestException(`Email or password are invalid`);
      } else {
        return this.authService.generateUserCredentials(user);
      }
    }

}
