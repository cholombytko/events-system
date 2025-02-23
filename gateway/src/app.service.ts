import { Injectable } from '@nestjs/common';
import { Readable, Transform } from 'stream';
import { EventSchema, EventType } from './schemas/event.schema';

@Injectable()
export class AppService {
  handleEvents(data: EventType[]): string {
    const readable = Readable.from(data, { objectMode: true });
    const validationTransform = new Transform({
      objectMode: true,
      transform(chunk: EventType, _, callback) {
        const result = EventSchema.safeParse(chunk);
        if (result.success) {
          callback(null, 'success\n');
        } else {
          callback(null, `${result.error}\n\n`);
        }
      },
    });
    readable.pipe(validationTransform).pipe(process.stdout);
    return 'success';
  }
}
