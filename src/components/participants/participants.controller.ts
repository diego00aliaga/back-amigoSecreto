import { Body, Controller, Get, HttpCode, Put, Request } from "@nestjs/common";
import { API_ROUTE_V1 } from "src/shared/consts";
import { IResponse } from "src/shared/interface/response.interface";
import { ParticipantsService } from "./participants.service";
import { AddParticipantDto } from "./dto/participant.dto";


@Controller({ path: API_ROUTE_V1 + 'participants/', version: '1' })
export class ParticipantsController {
    constructor(private readonly participantsService: ParticipantsService){}
    @Get('')
    async getParticipant(@Request() req: any) {
      try {
        const user = req.user;
        const response: IResponse<any> = await this.participantsService.getParticipants();
  
        return response;
      } catch (error) {
        throw error;
      }
    }

    @HttpCode(200)
    @Put('')
    async putParticipant(@Request() req: any, @Body() body: AddParticipantDto) {
      try {

        const response: IResponse<any> = await this.participantsService.putParticipant(
            body,
        );
  
        return response;
      } catch (error) {
        throw error;
      }
    }




}