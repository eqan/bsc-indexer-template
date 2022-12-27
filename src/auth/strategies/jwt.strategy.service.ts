import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import cookieParser from 'cookie-parser';
import { Strategy } from 'passport-jwt';
import { SystemErrors } from 'src/constants/errors.enum';

// Extracts Jwt token from first the cookies and then tries to fetch it from the headers.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: (req: any) => {
        try {
          if (req.headers.cookies) {
            const cookie = cookieParser(req.headers.cookies);
            return cookie['JWT_SECRET'];
          }
	          const jwtToken = req.headers?.authorization;
	console.log(jwtToken,"asdfasdf")        
  if (jwtToken) {
            return jwtToken.replace('Bearer ', '');
          }
        } catch (err) {
          throw new Error(SystemErrors.COOKIES_NOT_FOUND);
        }
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { payload, userId: payload.sub };
  }
}
