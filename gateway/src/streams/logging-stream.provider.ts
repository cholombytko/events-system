import { Injectable } from '@nestjs/common';
import { EventType } from '../schemas/event.schema';
import { Transform } from 'stream';
import { getCurrentTimestamp } from '../utils/timestamp.util';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class LoggingStream extends Transform {
  constructor(
    @InjectPinoLogger(LoggingStream.name) private readonly logger: PinoLogger,
  ) {
    super({
      objectMode: true,
      transform: (chunk: EventType, _, callback) => {
        if (!chunk) {
          return callback();
        }

        const timestamp = getCurrentTimestamp();

        this.logger.info(
          `${timestamp} Processing event from source: ${chunk.source}`,
        );
        callback(null, chunk);
      },
    });
  }
}
