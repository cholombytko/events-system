import { Injectable } from '@nestjs/common';
import { Counter, Gauge, register } from 'prom-client';
import { PrismaService } from '../database/prisma.service';
import { MetricsTypes } from '@prisma/client';

@Injectable()
export class MetricsService {
  private readonly counter: { [key: string]: Counter<string> } = {};
  private readonly gauge: { [key: string]: Gauge<string> } = {};

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

  public async setGauge(
    key: string,
    metricType: MetricsTypes,
    value: number,
    labels?: Record<string, string | number>,
  ) {
    const metric = await this.prismaService.metrics.findUnique({
      where: { type: metricType },
    });

    const newValue = metric ? metric.value + value : value;

    await this.prismaService.metrics.upsert({
      where: { type: metricType },
      update: { value: newValue },
      create: { type: metricType, value: newValue },
    });

    if (!this.gauge[key]) {
      this.gauge[key] = new Gauge({
        name: key,
        help: `Gauge for ${key}`,
        labelNames: labels ? Object.keys(labels) : [],
      });
    }

    this.gauge[key].set(labels || {}, newValue);
  }

  public async getAllMetrics() {
    return register.metrics();
  }
}
