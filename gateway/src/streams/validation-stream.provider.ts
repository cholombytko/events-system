import { Injectable } from '@nestjs/common';
import { EventType, EventSchema } from 'src/schemas/event.schema';
import { Transform } from 'stream';

@Injectable()
export class ValidationStream extends Transform {
  constructor() {
    super({
      objectMode: true,
      transform: async (chunk: EventType, _, callback) => {
        const result = EventSchema.safeParse(chunk);
        if (result.success) {
          callback(null, chunk);
        } else {
          console.error(`Validation error ${result.error}\n`);
          callback();
        }
      },
    });
  }
}
