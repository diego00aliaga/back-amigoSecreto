import { 
  IsString, 
  IsEmail, 
  IsNotEmpty, 
  MinLength, 
  MaxLength, 
  IsOptional 
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsEmail({}, { message: 'El formato del correo no es válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(50, { message: 'La contraseña es demasiado larga' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;

  // Campo opcional para el Amigo Secreto (ej: "Me gustan los libros")
  @IsString()
  @IsOptional()
  wishlist?: string;
}