import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import firebase from 'firebase-admin';

@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const firebaseConfig: any = configService.get<{
          projectId: string;
          privateKey: string;
          clientEmail: string;
        }>('firebase');

        const databaseURL = configService.get<string>('firebase.databaseURL');

        return firebase.initializeApp({
          credential: firebase.credential.cert(firebaseConfig),
        });
      },
    },
  ],
  exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule {}
