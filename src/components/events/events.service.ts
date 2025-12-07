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
    async addParticipant(eventId: string, email: string) {
        // 1. Buscamos si el usuario ya existe en la DB
        const existingUser = await this.userModel.findOne({ email });
    
        const newParticipant = {
            email: email,
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
}