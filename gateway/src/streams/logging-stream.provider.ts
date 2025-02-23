import { Injectable } from '@nestjs/common';
import { EventType } from '../schemas/event.schema';
import { Transform } from 'stream';
import { getCurrentTimestamp } from '../utils/timestamp.util';

@Injectable()
export class LoggingStream extends Transform {
  constructor() {
    super({
      objectMode: true,
      transform(chunk: EventType, _, callback) {
        if (!chunk) {
          return callback();
        }

        const timestamp = getCurrentTimestamp();

        console.log(
          `${timestamp} Processing event from source: ${chunk.source}`,
        );
        callback(null, chunk);
      },
    });
  }
}
