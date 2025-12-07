import { Type } from 'class-transformer';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsDateString, 
  IsNumber, 
  Min, 
  IsArray, 
  ValidateNested 
} from 'class-validator';
import { AddParticipantDto } from 'src/components/participants/dto/participant.dto';


export class CreateEventDto {
  @IsString({ message: 'El nombre del evento debe ser texto' })
  @IsNotEmpty({ message: 'El nombre del evento es obligatorio' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  // Valida formato ISO 8601 (ej: "2025-12-25T20:00:00.000Z")
  @IsDateString({}, { message: 'La fecha debe tener un formato válido (ISO 8601)' })
  @IsNotEmpty({ message: 'La fecha del evento es obligatoria' })
  date: string; 

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber({}, { message: 'El presupuesto debe ser un número' })
  @Min(0, { message: 'El presupuesto no puede ser negativo' })
  @IsNotEmpty({ message: 'Debes definir un presupuesto máximo' })
  budget: number;

  // OPCIONAL: Permite crear el evento ya con participantes
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true }) // Valida cada objeto dentro del array
  @Type(() => AddParticipantDto) // ¡CRUCIAL! Convierte el JSON a instancias de la clase DTO
  participants?: AddParticipantDto[];
}