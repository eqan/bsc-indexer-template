import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtTokenService: JwtService,
  ) {}

  async validateUser(message: string, signature: string, address: string): Promise<any>   {
      const signerAddress = await this.usersService.verifyWalletAndReturnSignerAddress(message, signature, address);
      if(signerAddress)
      {
        return signerAddress;
      }
      return null;
  }

  async generateUserCredentials(user: Users) {
    const payload = {
      address: user.userAddress,
      name: user.realName,
    };

    return {
      access_token: this.jwtTokenService.sign(payload),
    };
  }
}