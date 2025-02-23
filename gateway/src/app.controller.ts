import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { EventType } from './schemas/event.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async handleEvents(@Body() body: EventType[]): Promise<string> {
    return await this.appService.handleEvents(body);
  }
}
