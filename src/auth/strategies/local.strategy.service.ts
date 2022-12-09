import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserInput } from 'src/users/dto/logged-user.input';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      messageField: 'message',
      signatureField: 'signature',
      addressField: 'address',
    }); // email will be passed to validate function
  }

  async validate(
    message: string,
    signature: string,
    address: string,
  ): Promise<LoginUserInput> {
    // console.log(message);
    const user = this.authService.validateUser(message, signature, address);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
