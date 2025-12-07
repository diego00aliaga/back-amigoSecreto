import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('refresh-token') {
  handleRequest(err, check) {
    if (err || !check) {
      throw new UnauthorizedException({
        code: 401,
        message: 'Unauthorized',
        businessMessage: 'Invalid token',
        businessCode: 'ERROR_INVALID_TOKEN',
        payload: {},
      });
    }
    return check;
  }
}
