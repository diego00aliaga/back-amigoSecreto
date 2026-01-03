// src/user/dto/add-gift.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class AddGiftDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Nombre del regalo (Ej: "Calcetines con rombos")

  @IsString()
  @IsOptional()
  description?: string; // Talla, color, etc.

  @IsString()
  @IsOptional()
  value?: string; // Talla, color, etc.

  @IsString()
  @IsOptional()
  @IsUrl()
  link?: string; // Link de Amazon/MercadoLibre (Opcional)
}