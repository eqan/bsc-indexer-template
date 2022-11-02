import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Extracts Jwt token from first the cookies and then tries to fetch it from the headers.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      // jwtFromRequest: (req: any) =>
      // {
      //   try {
      //     if (req.headers.cookies) {
      //       const cookie = cookieParser(req.headers.cookies);
      //       console.log(cookie)
      //       return cookie['JWT_SECRET'];
      //     }
      //     return ExtractJwt.fromAuthHeaderAsBearerToken();
      //   } catch (err) {
      //     throw new Error(SystemErrors.COOKIES_NOT_FOUND);
      //   }
      // },
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { payload, userId: payload.sub };
  }
}