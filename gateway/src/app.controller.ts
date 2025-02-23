import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { EventType } from './schemas/event.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  handleEvents(@Body() body: EventType[]): string {
    return this.appService.handleEvents(body);
  }
}
