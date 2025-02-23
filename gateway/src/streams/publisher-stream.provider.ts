import { Injectable } from '@nestjs/common';
import { EventType } from 'src/schemas/event.schema';
import { Writable } from 'stream';
import { NatsService } from '../providers/nats-service';

@Injectable()
export class PublisherStream extends Writable {
  constructor(private readonly natsService: NatsService) {
    super({
      objectMode: true,
      write: (chunk: EventType, _, callback) => {
        const streamName = chunk.source;
        this.natsService
          .publishToStream(streamName, chunk)
          .then(() => {
            console.log(`Successfully published to ${streamName}\n`);
            callback();
          })
          .catch((error) => {
            console.error(`Error publishing to ${chunk.source} stream:`, error);
            callback(error);
          });
      },
    });
  }
}
