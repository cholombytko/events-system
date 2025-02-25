import { Injectable } from '@nestjs/common';
import { EventType } from 'src/schemas/event.schema';
import { Writable } from 'stream';
import { NatsService } from '../providers/nats-service';
import { MetricsService } from 'src/metrics/metrics.service';
import { MetricsTypes } from '@prisma/client';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class PublisherStream extends Writable {
  constructor(
    @InjectPinoLogger(PublisherStream.name) private readonly logger: PinoLogger,
    private readonly natsService: NatsService,
    private readonly metricsService: MetricsService,
  ) {
    super({
      objectMode: true,
      write: (chunk: EventType, _, callback) => {
        const streamName = chunk.source;
        this.natsService
          .publishToStream(streamName, chunk)
          .then(() => {
            this.logger.info(`Successfully published to ${streamName}\n`);
            this.metricsService.incCounter(
              'processed_events',
              MetricsTypes.processed_events,
            );
            callback();
          })
          .catch((error) => {
            this.logger.error(
              `Error publishing to ${chunk.source} stream:`,
              error,
            );
            callback(error);
          });
      },
    });
  }
}
