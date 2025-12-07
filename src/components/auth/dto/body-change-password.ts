import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { IsStrongPassword } from 'src/shared/validators/password.validator';

export class BodyChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  newPassword: string;
}
