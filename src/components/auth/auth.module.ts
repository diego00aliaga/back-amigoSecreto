import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from 'src/schemas/user.schema';
import { BearerTokenStrategy } from 'src/shared/strategies/jwt-token.strategy';
import { RefreshTokentStrategy } from 'src/shared/strategies/refresh-token.strategy';


@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),

  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    BearerTokenStrategy,
    RefreshTokentStrategy,
  ],
})
export class AuthModule {}
