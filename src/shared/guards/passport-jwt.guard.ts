import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class BearerTokenGuard extends AuthGuard('access-token') {
  handleRequest(err, check) {
    console.log("¢¢¢¢¢¢¢¢", check)
    if (err || !check) {
      throw new UnauthorizedException({
        code: 401,
        message: 'Unauthorized',
        businessMessage: 'Invalid token',
        typeResponse: 'O',
        businessCode: 'ERROR_INVALID_TOKEN',
        payload: {},
      });
    }
    return check;
  }
}
