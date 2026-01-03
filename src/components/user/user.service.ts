import { HttpException, HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

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
    const gift = { _id: new Types.ObjectId(), ...body };
    // 1. Buscamos y actualizamos en un solo paso (Atómico y seguro)
    const userDB = await this.userModel.findOneAndUpdate(
      { email: user.email }, // Filtro: Quién es el usuario
      {
        $push: { wishlist: gift }, // Acción: EMPUJAR el nuevo regalo al array 'wishlist'
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

  async deleteGift(user: any, giftId: string): Promise<IResponse<any>> {
    if (!Types.ObjectId.isValid(giftId)) {
      const response = {
        code: 400,
        message: 'Bad Request',
        businessMessage: 'Id de regalo inválido',
        businessCode: 'INVALID_GIFT_ID',
        payload: {},
      };
      throw new HttpException(response, response.code);
    }
    const giftObjectId = new Types.ObjectId(giftId);
    const userDB = await this.userModel
      .findOneAndUpdate(
        { email: user.email, 'wishlist._id': giftObjectId },
        { $pull: { wishlist: { _id: giftObjectId } } },
        { new: true },
      )
      .lean();

    if (!userDB) {
      const response = {
        code: 404,
        message: 'Not Found',
        businessMessage: 'Regalo no encontrado',
        businessCode: 'GIFT_NOT_FOUND',
        payload: {},
      };
      throw new HttpException(response, response.code);
    }

    return {
      code: 200,
      message: 'Success',
      businessMessage: 'Regalo eliminado exitosamente',
      businessCode: 'GIFT_DELETED',
      payload: userDB,
    };
  }



}