import { Body, Controller, Get, HttpCode, Param, Post, Put } from "@nestjs/common";
import { API_ROUTE_V1 } from "src/shared/consts";
import { IResponse } from "src/shared/interface/response.interface";
import { EventService } from "./events.service";
import { CreateEventDto } from "./dto/body-post-event.dto";

@Controller({ path: API_ROUTE_V1 + 'events/', version: '1' })
export class EventsController {
    constructor(
      private readonly eventService: EventService,
    ){}
    @HttpCode(200)
    @Get('')
    async getCountries() {
      try {
        const response = "Funciona el get events!"
        return response;
      } catch (error) {
        throw error;
      }
    }
    @HttpCode(200)
    @Post('')
    async postEvent(@Body() body: CreateEventDto){
      try {

        const response: IResponse<any> = await this.eventService.createEvent(
            body,
        );
  
        return response;
      } catch (error) {
        throw error;
      }
    }

    @HttpCode(200)
    @Put(':id')
    async putParticipant(@Param('id') id: string, @Body() body: any){
      try {

        const response: IResponse<any> = await this.eventService.addParticipant(
            id, body
        );
  
        return response;
      } catch (error) {
        throw error;
      }
    }


    @HttpCode(200)
    @Get('/start/:id')
    async startEvent(@Param('id') id: string){
      try {

        const response: IResponse<any> = await this.eventService.startMatching(
            id
        );
  
        return response;
      } catch (error) {
        throw error;
      }
    }
}
