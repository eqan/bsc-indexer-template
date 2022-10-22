import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(userAddress: string): Promise<any> {
    const user = await this.authService.validateUser(userAddress);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}