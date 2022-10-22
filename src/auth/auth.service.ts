import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(userAddress: string): Promise<any> {
    const user = await this.usersService.findOne(userAddress);
    if (user) {
      return user;
    }
   return null;        
  }

  async login(user: any) {
    const payload = { userAddress: user.userAddress, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }  
}