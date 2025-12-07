import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema'; // Importamos la clase User


// 1. Definimos un Sub-Schema para los participantes
// Esto ayuda a mantener limpio el Schema principal
@Schema()
export class Participant {

    @Prop({ type: Types.ObjectId, ref: 'User', required: false })
    user?: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string; // Para notificar a quién le tocó

    // El resultado del sorteo: ¿A quién le regala esta persona?
    // Se llena solo después de ejecutar el algoritmo de match
    @Prop({ type: String, default: null })
    target: string | null; 
    
    // IMPORTANTE: Lista de emails/IDs a los que NO puede regalar
    // (Ej: no quieres que le toque regalar a su propia pareja)
    @Prop({ type: [String], default: [] })
    exclusions: string[];
}

// Generamos el schema del sub-documento
export const ParticipantSchema = SchemaFactory.createForClass(Participant);