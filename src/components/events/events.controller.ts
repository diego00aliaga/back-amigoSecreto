import { Controller, Get, HttpCode } from "@nestjs/common";
import { API_ROUTE_V1 } from "src/shared/consts";

@Controller({ path: API_ROUTE_V1 + 'events/', version: '1' })
export class EventsController {

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
}