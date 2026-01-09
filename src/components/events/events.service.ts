import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Event } from "src/schemas/event.schema";
import { User } from "src/schemas/user.schema";

@Injectable()
export class EventService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Event.name) private eventModel: Model<Event>
    ){

    }

    async createEvent(body){
        let user = 'test'

        console.log("######3", body)
        let newEvent = await this.eventModel.create({
            name : body.name,
            description: body.description,
            date: body.date,
            location: body.location,
            budget: body.budget,
            createdBy: user
        })

        return {
            code: 200,
            message: 'Success',
            businessMessage: 'Guardado',
            businessCode: 'SUCCESS',
            payload: newEvent,
          };
    }
 
 // Ejemplo conceptual en tu EventService
    async addParticipant(eventId: string, body: any) {
        // 1. Buscamos si el usuario ya existe en la DB
        const existingUser = await this.userModel.findOne({ email: body.email });
    
        const newParticipant = {
            email: body.email,
            // Si existe usamos su ID, si no, undefined
            user: existingUser ? existingUser._id : undefined,
            // Si existe usamos su nombre real, si no, el input
            name: existingUser ? existingUser.name : undefined,
            target: null,
            exclusions: []
        };
        let addedParticipant = await  this.eventModel.findByIdAndUpdate(
            eventId,
            { $push: { participants: newParticipant } },
            { new: true }
        );
        return {
            code: 200,
            message: 'Success',
            businessMessage: 'Guardado',
            businessCode: 'SUCCESS',
            payload: addedParticipant,
          };
        // 2. Hacemos push al array


    }

    async findMyEvents(myUserId: string) {
        return this.eventModel.find({
            $or: [
                { createdBy: myUserId },          // Soy el admin
                { 'participants.user': myUserId } // Estoy en la lista
            ]
        });
    }


    async startMatching(eventId: string) {
        // Lógica para hacer el "matching" de participantes
        // 1. Obtener el evento y sus participantes
        const event = await this.eventModel.findById(eventId);
        if (!event) {
            throw new Error('Evento no encontrado');
        }

        const participants = event.participants;
        // Aquí iría la lógica para asignar targets y manejar exclusiones
        const participantes = [...participants].sort(() => Math.random() - 0.5);

        // 2. Actualizar el evento con los resultados del matching
        const resultado = participantes.map((persona, index) => {
            const amigoSecreto = participantes[index + 1] || participantes[0];
            this.eventModel.findOneAndUpdate(
                { 
                _id: eventId, 
                'participants._id': (persona as any)._id // 1. Buscamos el evento y el participante específico
                },
                { 
                $set: { 
                    'participants.$.target': (amigoSecreto as any)._id // 2. El '$' referencia al participante encontrado
                } 
                },
                { new: true }
                );
        })
        
        await Promise.all(resultado);
        event.status = 'MATCHED';
        let eventMatched = await event.save();

        return {
            code: 200,
            message: 'Success',
            businessMessage: 'Matching realizado',
            businessCode: 'MATCHING_DONE',
            payload: eventMatched,
          };
    }
}