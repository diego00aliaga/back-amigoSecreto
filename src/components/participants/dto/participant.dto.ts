import { 
    IsString, 
    IsEmail, 
    IsNotEmpty, 
    IsArray, 
    IsOptional, 
    ArrayUnique, 
    IsMongoId
  } from 'class-validator';
  
  export class AddParticipantDto {
    @IsString({ message: 'El nombre debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name: string;
  
    @IsEmail({}, { message: 'Debes proporcionar un email válido' })
    @IsNotEmpty({ message: 'El email es obligatorio' })
    email: string;
  
    @IsOptional()
    @IsArray({ message: 'Las exclusiones deben ser una lista (array)' })
    @IsString({ each: true, message: 'Cada exclusión debe ser un string (email)' })
    @ArrayUnique({ message: 'No puede haber exclusiones repetidas en la lista' })
    // Nota: Si usas IDs para excluir, cambia @IsString por @IsMongoId
    exclusions?: string[];
  }