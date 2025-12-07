import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class BodyResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  tokenGoogle: string;
}
