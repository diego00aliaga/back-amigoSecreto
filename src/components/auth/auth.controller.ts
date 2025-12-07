import { Body, Controller, Get, HttpCode, Logger, Post, UseGuards, Request } from "@nestjs/common";
import { HeadersLoginDto } from "./dto/headers-login.dto";
import { BodySignUpDto } from "./dto/body-sign-up.dto";
import { AuthService } from "./auth.service";
import { API_ROUTE_V1 } from "src/shared/consts";
import { Header } from '../../shared/decorators/validator-header.decorator';
import { IResponse } from "src/shared/interface/response.interface";
import { BodySignInDto } from "./dto/body-sign-in.dto";
import { FirebaseAuthGuard } from "src/guard.firebase";

@Controller({ path: API_ROUTE_V1 + 'auth/', version: '1' })
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) {}

    @HttpCode(200)
    @Post('sign-in')
    async auth(
      @Header(HeadersLoginDto) headers: HeadersLoginDto,
      @Body() body: BodySignInDto,
    ) {
      try {
        this.logger.log('Sign In');
        // lower case the email
        body.email = body.email.toLowerCase();
        const response: IResponse<any> = await this.authService.signIn(
          headers,
          body,
        );
  
        this.logger.log('Sign In response');
  
        return response;
      } catch (error) {
        this.logger.error('Sign In error', error?.message);
        throw error;
      }
    }


    @HttpCode(200)
    @Post('sign-up')
    async signUp(
      @Header(HeadersLoginDto) headers: HeadersLoginDto,
      @Body() body: BodySignUpDto,
    ) {
      try {
        body.email = body.email.toLowerCase();
  
        const response: IResponse<any> = await this.authService.signUp(
          headers,
          body,
        );
  
        return response;
      } catch (error) {
        throw error;
      }
    }

    @Get('sign-google')
    @UseGuards(FirebaseAuthGuard)
    async authGoogle(
      @Header(HeadersLoginDto) headers: HeadersLoginDto,
      @Request() req: any,
    ) {
      try {
        console.log(
          '%csrc/components/auth/auth.controller.ts:70 req',
          'color: #007acc;',
          req.user,
        );
        const user = req.user;
        const response: IResponse<any> = await this.authService.authGoogle(
          user,
          headers,
        );
  
        this.logger.log('Sign In response');
  
        return response;
      } catch (error) {
        this.logger.error('Sign In error', error?.message);
        throw error;
      }
    }
}