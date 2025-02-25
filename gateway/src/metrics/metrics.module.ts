import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { PrismaModule } from '../database/prisma.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [PrismaModule, PrometheusModule.register()],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {}
