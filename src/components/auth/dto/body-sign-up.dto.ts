import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  IsIn,
  Equals,
  Length,
} from 'class-validator';

import { IsStrongPassword } from 'src/shared/validators/password.validator';

export class BodySignUpDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, undefined, { message: 'name must be at least 4 characters long' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['male', 'female'], {
    message: 'Gender must be either male or female ',
  })
  gender: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['sugar', 'baby'], {
    message: 'Iam must be either sugar or baby',
  })
  iam: string;

  @IsBoolean()
  @Equals(true, {
    message: 'You must agree to the terms and conditions',
  })
  agreements: boolean;

  @IsString()
  @IsNotEmpty()
  tokenGoogle: string;
}
