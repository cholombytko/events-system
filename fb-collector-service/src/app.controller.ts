import { Controller, Post } from '@nestjs/common';
import { FacebookEventsService } from './services/facebook-events.service';
import { FacebookEvent } from '@prisma/client';
// import {
//   FacebookEventSchema,
//   FacebookEventType,
// } from './schemas/facebook-event.schema';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller()
export class AppController {
  constructor(
    @InjectPinoLogger(AppController.name) private readonly logger: PinoLogger,
    private readonly appService: FacebookEventsService,
  ) {}

  @Post()
  async getHello(): Promise<FacebookEvent | string> {
    try {
      //const validatedFacebookEvent = FacebookEventSchema.parse(event);
      //return await this.appService.insertEvent(validatedFacebookEvent);
    } catch (error) {
      this.logger.error(`Validating event error: ${error}`);
      return error;
    }
  }
}
