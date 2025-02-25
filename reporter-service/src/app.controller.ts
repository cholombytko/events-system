import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  DemographicsFilterType,
  EventsFilterType,
  RevenueFilterType,
} from './types/filters.types';
import {
  EventsFilterSchema,
  RevenueFilterSchema,
} from './schemas/filters.schema';
import { ZodError } from 'zod';

@Controller('reports')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('events')
  async getEventAggregation(
    @Body() data: EventsFilterType,
  ): Promise<string | ZodError> {
    const validatedData = EventsFilterSchema.safeParse(data);
    if (validatedData.success) {
      const total = await this.appService.getEventStatistics(
        validatedData.data,
      );
      return `Event statistics:\n Total events: ${total}`;
    }
    return validatedData.error;
  }

  @Get('revenue')
  async getRevenueData(
    @Body() data: RevenueFilterType,
  ): Promise<string | ZodError> {
    const validatedData = RevenueFilterSchema.safeParse(data);
    if (validatedData.success) {
      const total = await this.appService.getRevenueData(validatedData.data);
      return `Revenue statistics:\n Total revenue: ${total}`;
    }
    return validatedData.error;
  }

  @Get('demographics')
  async getDemographicsData(
    @Body() data: DemographicsFilterType,
  ): Promise<object | ZodError> {
    const validatedData = RevenueFilterSchema.safeParse(data);
    if (validatedData.success) {
      const demographics = await this.appService.getDemographicData(
        validatedData.data,
      );
      return demographics;
    }
    return validatedData.error;
  }
}
