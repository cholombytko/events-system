import { Injectable } from '@nestjs/common';
import { Counter, register } from 'prom-client';
import { PrismaService } from '../database/prisma.service';
import { MetricsTypes } from '@prisma/client';

@Injectable()
export class MetricsService {
  private readonly counter: { [key: string]: Counter<string> } = {};

  constructor(private readonly prismaService: PrismaService) {}

  public async incCounter(
    key: string,
    metricType: MetricsTypes,
    labels?: Record<string, string | number>,
  ) {
    await this.prismaService.metrics.upsert({
      where: {
        type: metricType,
      },
      update: {
        value: {
          increment: 1,
        },
      },
      create: {
        type: metricType,
        value: 1,
      },
    });

    if (!this.counter[key]) {
      this.counter[key] = new Counter({
        name: key,
        help: `Counter for ${key}`,
        labelNames: labels ? Object.keys(labels) : [],
      });
    }
    this.counter[key].inc(labels);
  }

  public async getAllMetrics() {
    return register.metrics();
  }
}
