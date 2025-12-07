import { HttpException, HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IResponse } from 'src/shared/interface/response.interface';



import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/body-put-profile.dto';
import { AddGiftDto } from './dto/put-gift-profile';




@Injectable()
export class UserService {
  private readonly storage: Storage;
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,

  ) {

  }

  async getUser(user: any): Promise<IResponse<any>> {
    let userDB: any = await this.userModel.findOne({
      email: user.email,
    });

    if (!userDB) {
      const response = {
        code: 404,
        message: 'Not Found',
        businessMessage: 'User not found',
        businessCode: 'USER_NOT_FOUND',
        payload: {},
      };
      throw new HttpException(response, response.code);
    }

    userDB = userDB.toObject();



    return {
      code: 200,
      message: 'Success',
      businessMessage: 'Guardado',
      businessCode: 'SUCCESS',
      payload: {
        ...userDB,

        // profile: profile || {}
      },
    };
  }

  async putUser(user: any, body: CreateUserDto): Promise<IResponse<any>> {
    
    let userDB: any = await this.userModel.findOne({
      email: user.email,
    });

    if (!userDB) {
      return {
        code: 404,
        message: 'Not Found',
        businessMessage: 'User not found',
        businessCode: 'USER_NOT_FOUND',
        payload: {},
      };
    }

    userDB = userDB.toObject();

    userDB = await this.userModel.findOneAndUpdate(
      { email: userDB.email },
      {
        ...body,
      },
      { upsert: true, new: true },
    );
    userDB = userDB.toObject();

    return {
      code: 200,
      message: 'Success',
      businessMessage: 'Guardado',
      businessCode: 'SUCCESS',
      payload: {
        ...userDB,

      },
    };
  }

  // ... imports anteriores


  // ... dentro de la clase UserService
  async addGift(user: any, body: AddGiftDto): Promise<IResponse<any>> {
    // 1. Buscamos y actualizamos en un solo paso (Atómico y seguro)
    const userDB = await this.userModel.findOneAndUpdate(
      { email: user.email }, // Filtro: Quién es el usuario
      {
        $push: { wishlist: body }, // Acción: EMPUJAR el nuevo regalo al array 'wishlist'
      },
      { new: true } // Opción: Devuélveme el usuario YA actualizado (con el regalo nuevo)
    ).lean(); // .lean() lo convierte a objeto JS simple (más rápido que toObject)

    // 2. Validación por si el usuario no existe
    if (!userDB) {
      const response = {
        code: 404,
        message: 'Not Found',
        businessMessage: 'User not found',
        businessCode: 'USER_NOT_FOUND',
        payload: {},
      };
      throw new HttpException(response, response.code);
    }

    // 3. Respuesta exitosa
    return {
      code: 200,
      message: 'Success',
      businessMessage: 'Regalo agregado exitosamente',
      businessCode: 'GIFT_ADDED',
      payload: userDB, 
    };
  }



}