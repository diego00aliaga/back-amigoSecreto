import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class BearerTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  private readonly logger = new Logger(BearerTokenStrategy.name);
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('accessTokenSecret'),
    });
  }

  async validate(payload: any) {
    if (!payload.codigosesion) {
      this.logger.log(`[validate] - UnauthorizedException]`);
      throw new UnauthorizedException({
        code: 401,
        message: 'Unauthorized',
        businessMessage: 'Unauthorized',
        businessCode: 'UNAUTHORIZED',
        payload: {},
      });
    }
    // this.logger.log(`[validate] - Valid token]`);
    return payload;
  }
}
