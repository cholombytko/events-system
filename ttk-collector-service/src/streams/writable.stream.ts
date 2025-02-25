import { Injectable } from '@nestjs/common';
import { TiktokEventsService } from '../services/tiktok-events.service';
import { Writable } from 'stream';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class DBWritableStream extends Writable {
  private batch = [];
  private MAX_BATCH_SIZE = 10;

  constructor(
    @InjectPinoLogger(DBWritableStream.name)
    private readonly logger: PinoLogger,
    private readonly tiktokEventsService: TiktokEventsService,
  ) {
    super({
      objectMode: true,
      write: async (chunk, _, callback) => {
        const message = await chunk;
        try {
          const event = message.json();

          this.batch.push(event);

          if (this.batch.length >= this.MAX_BATCH_SIZE) {
            const affected = await this.tiktokEventsService.insertEvent(
              this.batch,
            );
            this.logger.info({ affected_rows: affected.count });
            this.batch = [];
          }

          message.ack();
          callback();
        } catch (error) {
          this.logger.error(error);
          message.ack();
          callback();
        }
      },
    });
  }
}
