import { Injectable} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Participant } from "src/schemas/participants.schema";
import { Model } from 'mongoose';
import { AddParticipantDto } from "./dto/participant.dto";
import { IResponse } from 'src/shared/interface/response.interface';


@Injectable()
export class ParticipantsService {
    constructor(
        @InjectModel(Participant.name) private participantModel: Model<Participant>
    ){

    }

    async getParticipants(){
        let participants: any = await this.participantModel.find()
        return {
            code: 200,
            message: 'Success',
            businessMessage: 'Guardado',
            businessCode: 'SUCCESS',
            payload: {
              ...participants
            },
          };
    }

    async putParticipant(body: AddParticipantDto ): Promise<IResponse<any>>{
        let participantDB = await this.participantModel.findOneAndUpdate(
            {email: body.email},
            {...body},
            { upsert: true, new: true },
        );
        return {
            code: 200,
            message: 'Success',
            businessMessage: 'Guardado',
            businessCode: 'SUCCESS',
            payload: {
                ...participantDB
            },
          };
    }


}   