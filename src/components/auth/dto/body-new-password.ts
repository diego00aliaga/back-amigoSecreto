import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class BodyNewPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  tokenResetPassword;

  @IsString()
  @IsNotEmpty()
  tokenGoogle: string;
}
