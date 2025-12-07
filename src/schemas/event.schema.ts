import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Participant, ParticipantSchema } from './participants.schema';


export type EventDocument = HydratedDocument<Event>;


@Schema({ timestamps: true }) 
export class Event {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    date: Date; // Fecha del intercambio

    @Prop()
    location: string;

    @Prop({ required: true })
    budget: number; // Monto máximo del regalo
    @Prop({ 
        type: String, 
        enum: ['CREATED', 'MATCHED', 'FINISHED'], 
        default: 'CREATED' 
    })
    status: string;

    // Aquí incrustamos el array de participantes
    @Prop({ type: [ParticipantSchema], default: [] })
    participants: Participant[];

    // El organizador (Admin del evento)
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy: Types.ObjectId;
}

export const EventSchema = SchemaFactory.createForClass(Event)