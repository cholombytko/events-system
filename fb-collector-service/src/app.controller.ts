import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { FacebookEvent } from '@prisma/client';
import {
  FacebookEventSchema,
  FacebookEventType,
} from './schemas/facebook-event.schema';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller()
export class AppController {
  constructor(
    @InjectPinoLogger(AppController.name) private readonly logger: PinoLogger,
    private readonly appService: AppService,
  ) {}

  @Post()
  async getHello(
    @Body() event: FacebookEventType,
  ): Promise<FacebookEvent | string> {
    try {
      const validatedFacebookEvent = FacebookEventSchema.parse(event);
      return await this.appService.insertEvent(validatedFacebookEvent);
    } catch (error) {
      this.logger.error(`Validating event error: ${error}`);
      return error;
    }
  }
}
