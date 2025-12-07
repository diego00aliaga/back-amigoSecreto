// schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
class Gift {
    @Prop() name: string;
    @Prop() description?: string;
    @Prop() link?: string;
  }

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    photo: string;

    @Prop({ select: false }) // Ocultar password por defecto
    password: string; 
    
    // Opcional: Preferencias de regalo globales
    @Prop([Gift]) // <--- AQUÍ: Array de objetos Gift
    wishlist: Gift[];
}

export const UserSchema = SchemaFactory.createForClass(User);