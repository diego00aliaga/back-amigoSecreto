import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { IsStrongPassword } from 'src/shared/validators/password.validator';

export class BodySignInDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  // @IsString()
  // @IsNotEmpty()
  // tokenGoogle: string;
}
