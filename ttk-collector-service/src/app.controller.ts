import { Controller, Post } from '@nestjs/common';
import { TiktokEventsService } from './services/tiktok-events.service';
//import { TiktokEvent } from '@myorg/prisma';
// import {
//   FacebookEventSchema,
//   FacebookEventType,
// } from './schemas/facebook-event.schema';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller()
export class AppController {
  constructor(
    @InjectPinoLogger(AppController.name) private readonly logger: PinoLogger,
    private readonly appService: TiktokEventsService,
  ) {}

  @Post()
  async getHello(): Promise<string> {
    try {
      //const validatedFacebookEvent = FacebookEventSchema.parse(event);
      //return await this.appService.insertEvent(validatedFacebookEvent);
    } catch (error) {
      this.logger.error(`Validating event error: ${error}`);
      return error;
    }
  }
}
