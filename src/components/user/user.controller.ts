import {
  Controller,
  Get,
  HttpCode,
  UseGuards,
  Request,
  Post,
  Res,
  Put,
  Body,
  UseInterceptors,
  UploadedFile,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { API_ROUTE_V1 } from 'src/shared/consts';

import { IResponse } from 'src/shared/interface/response.interface';
import { CreateUserDto } from './dto/body-put-profile.dto';
import { AddGiftDto } from './dto/put-gift-profile';
import { BearerTokenGuard } from 'src/shared/guards/passport-jwt.guard';






@Controller({ path: API_ROUTE_V1 + 'user/', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(200)
  @UseGuards(BearerTokenGuard)
  @Get('')
  async getUser(@Request() req: any) {
    try {
      const user = req.user;
      const response: IResponse<any> = await this.userService.getUser(user);

      return response;
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(200)
  @UseGuards(BearerTokenGuard)
  @Put('')
  async putUser(@Request() req: any, @Body() body: CreateUserDto) {
    try {
      const user = req.user;
      const response: IResponse<any> = await this.userService.putUser(
        user,
        body,
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(200)
  @UseGuards(BearerTokenGuard)
  @Put('addGift')
  async putGift(@Request() req: any, @Body() body: AddGiftDto){
    try{
      const user = req.user;
      const response: IResponse<any> = await this.userService.addGift(
        user,
        body,
      );

      return response;
    } catch(error){
      throw error
    }
  }

  @HttpCode(200)
  @UseGuards(BearerTokenGuard)
  @Delete('gift/:giftId')
  async deleteGift(@Request() req: any, @Param('giftId') giftId: string) {
    try {
      const user = req.user;
      const response: IResponse<any> = await this.userService.deleteGift(
        user,
        giftId,
      );

      return response;
    } catch (error) {
      throw error;
    }
  }
}