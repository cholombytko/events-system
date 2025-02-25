import { Injectable } from '@nestjs/common';
import { MetricsTypes } from '@prisma/client';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { MetricsService } from 'src/metrics/metrics.service';
import { EventType, EventSchema } from 'src/schemas/event.schema';
import { Transform } from 'stream';

@Injectable()
export class ValidationStream extends Transform {
  constructor(
    @InjectPinoLogger(ValidationStream.name)
    private readonly logger: PinoLogger,
    private readonly metricsService: MetricsService,
  ) {
    super({
      objectMode: true,
      transform: async (chunk: EventType, _, callback) => {
        this.metricsService.incCounter(
          'accepted_events',
          MetricsTypes.accepted_events,
        );
        const result = EventSchema.safeParse(chunk);
        if (result.success) {
          callback(null, chunk);
        } else {
          this.logger.error(`Validation error ${result.error}\n`);
          this.metricsService.incCounter(
            'failed_events',
            MetricsTypes.failed_events,
          );
          callback();
        }
      },
    });
  }
}
