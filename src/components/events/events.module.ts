import { Module } from "@nestjs/common";
import { EventsController } from "./events.controller";
import { EventService } from "./events.service";
import { Event, EventSchema } from "src/schemas/event.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/schemas/user.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Event.name, schema: EventSchema},
            {name: User.name, schema: UserSchema}
        ])
    ],
    controllers: [EventsController],
    providers: [EventService]
})

export class EventsModule {}