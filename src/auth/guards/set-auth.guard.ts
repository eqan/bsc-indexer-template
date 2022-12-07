import { CookieSerializeOptions } from 'cookie';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../auth.service';

const domain = process.env.WEB_APP_HOST;
const jwtExpiresSecond = process.env.JWT_EXPIRES_SECONDS;

const HTTP_ONLY_COOKIE: CookieSerializeOptions = {
  maxAge: Number(jwtExpiresSecond), // cookie lives same amount of time as jwt
  httpOnly: true,
  domain,
};

// const USERS_COOKIE: CookieSerializeOptions = {
//   maxAge: Number(jwtExpiresSecond), // cookie lives same amount of time as jwt
//   domain,
// };

@Injectable()
export class SetAuthGuard extends AuthGuard('local') {
  constructor(private authService: AuthService) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const context_ = GqlExecutionContext.create(context);
    const request = context_.getContext();

    // should be the same name as args
    request.body = context_.getArgs().LoginUserInput;

    return request;
  }

  handleRequest(error, user, info, context) {
    console.log(error);
    console.log(info);
    console.log(user);
    console.log(context);
    // if (error || !user || !info) throw error || new UnauthorizedException();

    const authContext = GqlExecutionContext.create(context);
    user = authContext.getArgs().LoginUserInput;
    // const [req, res] = authContext.getArgs();
    // console.log(req, res, 'req,res');
    // authContext.getRequest<Request>();
    const { reply } = authContext.getContext();
    // console.log(reply.args);
    const accessToken = this.authService.generateUserAccessToken(
      user.id,
      user.userSignature,
      user.date,
    );
    const { args } = reply;
    console.log(args);
    // res.cookie('cookie', accessToken);
    // res.header('Authentication', 'Bearer ');
    // reply.res.cookie('cookie', accessToken);
    // reply.res.header('Authentication', 'Bearer ');
    // reply.res.cookie()
    // reply.setCookie('token', accessToken, HTTP_ONLY_COOKIE);
    return user;
  }
}
