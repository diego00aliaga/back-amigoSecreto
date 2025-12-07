import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokentStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  private readonly logger = new Logger(RefreshTokentStrategy.name);
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get<string>('refreshTokenSecret'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    if (!payload?.codigosesion) {
      this.logger.log(`[validate] - UnauthorizedException]`);
      throw new UnauthorizedException({
        code: 401,
        message: 'Unauthorized',
        businessMessage: 'Unauthorized',
        businessCode: 'UNAUTHORIZED',
        payload: {},
      });
    }
    // this.logger.log(`[validate] - Refresh Token Ok]`);
    return payload;
  }
}
