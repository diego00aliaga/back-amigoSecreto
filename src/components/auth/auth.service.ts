import { HttpException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/schemas/user.schema";
import { HeadersLoginDto } from './dto/headers-login.dto';
import { BodySignInDto } from './dto/body-sign-in.dto';
import { Model } from "mongoose";
import { IResponse } from "src/shared/interface/response.interface";
import { uid } from 'uid';
import * as bcrypt from 'bcrypt';
import { BodySignUpDto } from "./dto/body-sign-up.dto";

@Injectable()
export class AuthService{
    private readonly logger = new Logger(AuthService.name);

    constructor(
      private readonly configService: ConfigService,
      private jwtService: JwtService,
      @InjectModel(User.name) private userModel: Model<User>,

  
    //   private _authClient: AuthClient,
    //   private sendgridService: SendgridService,
    ) {}
async signIn(
    headers: HeadersLoginDto,
    body: BodySignInDto,
  ): Promise<IResponse<any>> {
    this.logger.log('Sign In');



    console.log(body.email);
    let user: any = await this.userModel.findOne({
      email: body.email,
      blockUser: { $ne: true },
    }).select('+password') // <--- ¡ESTA ES LA CLAVE!;
    console.log(user);

    if (!user) {
      const response = {
        code: 401,
        message: 'Unauthorized',
        businessMessage: 'Contraseña o email incorrecto',
        businessCode: 'UNAUTHORIZED',
        payload: {
          error: 'Unauthorized',
        },
      };
      throw new HttpException(response, response.code);
    }

    const attempts = user.attempts ? user.attempts + 1 : 1;

    if (attempts > 20) {
      // send restablecer contrasena
      const tokenResetPassword = uid(64);

      await this.userModel.updateOne(
        {
          email: user.email,
        },
        {
          tokenResetPassword,
        },
      );



    const response = {
        code: 401,
        message: 'Unauthorized',
        businessMessage:
          'su cuenta ha sido bloqueada, correo enviado para restablecer contraseña',
        businessCode: 'UNAUTHORIZED',
        payload: {
          error: 'Unauthorized',
        },
      };
      throw new HttpException(response, response.code);
    }


    const compare = await bcrypt.compare(body.password, user.password);

    this.logger.log('Sign In compare');

    if (!compare) {
      console.log(user);
      if (user.emailVerified === true) {
        await this.userModel.updateOne(
          {
            email: user.email,
          },
          {
            attempts,
          },
        );
      }

      const response = {
        code: 401,
        message: 'Unauthorized',
        businessMessage: 'Contraseña o email incorrecto',
        businessCode: 'UNAUTHORIZED',
        payload: {
          error: 'Unauthorized',
        },
      };
      this.logger.log('Sign In compare error');
      throw new HttpException(response, response.code);
    }

    if (user.emailVerified === false) {
      const response = {
        code: 401,
        message: 'Unauthorized',
        businessMessage: 'Correo no verificado',
        businessCode: 'EMAIL_NOT_VERIFIED',
        payload: {
          error: 'Unauthorized',
        },
      };

      this.logger.log('Sign In email not verified');
      throw new HttpException(response, response.code);
    }

    this.logger.log('Sign In subscription');

    const dataJwt = {
      iss: headers.iss,
      sub: headers.sub,
      aud: headers.aud,
      jti: uid(32),
      codigosesion: headers.codigosesion,
      email: user.email,
      name: user.name,
      _id: user._id,
    };

    this.logger.log('Sign In dataJwt');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(dataJwt, {
        secret: this.configService.get<string>('accessTokenSecret'),
        expiresIn: this.configService.get<string>('accessTokenExpiresIn') as any,
      }),
      this.jwtService.signAsync(dataJwt, {
        secret: this.configService.get<string>('refreshTokenSecret'),
        expiresIn: this.configService.get<string>('refeshTokenExpiresIn') as any,
      }),
    ]).catch((error) => {
      const response = {
        code: 500,
        message: 'Error',
        businessMessage: 'Error generating JWT',
        businessCode: 'ERROR_GENERATING_JWT',
        payload: {
          error: error.message || 'Error generating JWT',
        },
      };
      this.logger.log('Sign In error generating jwt');
      throw new HttpException(response, response.code);
    });

    const expire = this.getExpireValue(accessToken);

    const tokens = {
      accessToken,
      refreshToken,
      expire,
    };

    // const profile = await this.profileModel.findOne({ email: user.email });

    const response = {
      code: 200,
      message: 'OK',
      businessMessage: 'Guardado',
      businessCode: 'GENERATE_TOKEN',
      payload: {
        ...tokens,
        user: {
          ...user,
        },
      },
    };
    const { _id, ...userData } = user;
    console.log("ANTES#####")
    this.userModel
      .updateOne(
        {
          _id: _id,
          
        },
        { $set: userData }   // 2. DATA: ¿Qué campos cambio?
      )
      .then((res) => {
        this.logger.log('Sign In update last login ' + body.email);
      });
      console.log("DESPUES#####")

    this.logger.log('Sign In end');

    return response;
  }



  
  async signUp(
    headers: HeadersLoginDto,
    body: BodySignUpDto,
  ): Promise<IResponse<any>> {


    // validate email
    const userExist = await this.userModel.findOne({
      email: body.email,
    });

    if (userExist) {
      const response = {
        code: 400,
        message: 'Bad Request',
        businessMessage: 'Usuario ya existe',
        businessCode: 'USER_EXIST',
        payload: {
          error: [
            {
              property: 'email',
              message: 'Usuario ya existe',
            },
          ],
        },
      };
      throw new HttpException(response, response.code);
    }

    const passwordEncrypted = await this.encrypt(body.password);
    const token = uid(64);

    let user: any = new this.userModel({
      email: body.email,
      password: passwordEncrypted,
      name: body.name,
      createdAt: new Date(),
      emailVerified: false,
      tokenConfirmEmail: token,
    });
    user = await user.save();
    console.log("DESPUES#####")

    const response = {
      code: 200,
      message: 'OK',
      businessMessage: 'Correo enviado para confirmar cuenta',
      businessCode: 'SIGN_UP',
      payload: {},
    };

    return response;
  }



  async authGoogle(user: any, headers): Promise<IResponse<any>> {
// No necesitas 'let' ni el 'if'. Hazlo todo en una sola consulta.
    console.log("######", user)
    const userDB = await this.userModel.findOneAndUpdate(
        { email: user.email }, // 1. Busca por email
        {
        $set: {
            name: user.name, // Actualiza nombre y foto siempre (para mantenerlos al día)
        },
        $setOnInsert: {
            createdAt: new Date(), // Solo pone fecha si está CREANDO el documento
            photo: user.picture,
        },
        },
        {
        new: true,    // Devuelve el usuario final (ya sea el encontrado o el creado)
        upsert: true, // "Update or Insert": Si no existe, lo crea.
        },
    );
    const dataJwt = {
      iss: headers.iss,
      sub: headers.sub,
      aud: headers.aud,
      jti: uid(32),
      codigosesion: headers.codigosesion,
      email: userDB.email,
      name: userDB.name,
      _id: userDB._id,
    };

    this.logger.log('Sign In dataJwt');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(dataJwt, {
        secret: this.configService.get<string>('accessTokenSecret'),
        expiresIn: this.configService.get<string>('accessTokenExpiresIn') as any,
      }),
      this.jwtService.signAsync(dataJwt, {
        secret: this.configService.get<string>('refreshTokenSecret'),
        expiresIn: this.configService.get<string>('refeshTokenExpiresIn') as any,
      }),
    ]).catch((error) => {
      const response = {
        code: 500,
        message: 'Error',
        businessMessage: 'Error generating JWT',
        businessCode: 'ERROR_GENERATING_JWT',
        payload: {
          error: error.message || 'Error generating JWT',
        },
      };
      this.logger.log('Sign In error generating jwt');
      throw new HttpException(response, response.code);
    });

    const expire = this.getExpireValue(accessToken);

    const tokens = {
      accessToken,
      refreshToken,
      expire,
    };

    const response = {
      code: 200,
      message: 'OK',
      businessMessage: 'Guardado',
      businessCode: 'GENERATE_TOKEN',
      payload: {
        ...tokens,
        user: {
          ...user,
        },
      },
    };

    this.userModel
      .updateOne(
        {
          _id: userDB._id,
        },
        {
          lastLogin: new Date(),
        },
      )
      .then((res) => {
        this.logger.log('Sign In update last login ' + userDB.email);
      });

    this.logger.log('Sign In end');

    return response;
  }

  private getExpireValue(token: string) {
    return this.jwtService.decode(token)['exp'];
  }
  private async encrypt(password: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    return hash;
  }
}

