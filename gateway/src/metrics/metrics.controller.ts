import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricService: MetricsService) {}

  @Get()
  async getMetrics() {
    return await this.metricService.getAllMetrics();
  }
}
