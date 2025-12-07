import { Module } from "@nestjs/common";

import { ParticipantsController } from "./participants.controller";
import { ParticipantsService } from "./participants.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Participant, ParticipantSchema } from "src/schemas/participants.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Participant.name, schema: ParticipantSchema}
        ])

    ],
    providers: [ParticipantsService],
    controllers: [ParticipantsController],
})

export class ParticipantsModule {}