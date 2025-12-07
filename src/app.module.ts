import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './components/events/events.module';
import { MongooseModule } from '@nestjs/mongoose';
import dotenv from 'dotenv'
import { ParticipantsModule } from './components/participants/participants.module';
import { UserModule } from './components/user/user.module';
import { AuthModule } from './components/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { env } from './config/env';
import { FirebaseModule } from './firebase.module';

dotenv.config({ path: './.env' })


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [env],
      isGlobal: true,
    }),
    EventsModule,
    ParticipantsModule,
    UserModule,
    AuthModule,
    FirebaseModule,
    MongooseModule.forRoot(process.env.MONGO_URL || 'http://localhost:3000')  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
