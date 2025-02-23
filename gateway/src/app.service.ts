import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { EventType } from './schemas/event.schema';
import { ValidationStream } from './streams/validation-stream.provider';
import { PublisherStream } from './streams/publisher-stream.provider';
import { LoggingStream } from './streams/logging-stream.provider';

@Injectable()
export class AppService {
  private MAX_LISTENERS = 20;

  constructor(
    private readonly validationStream: ValidationStream,
    private readonly publisherStream: PublisherStream,
    private readonly loggingStream: LoggingStream,
  ) {}

  async handleEvents(data: EventType[]): Promise<string> {
    const readable = Readable.from(data, { objectMode: true });

    this.publisherStream.setMaxListeners(this.MAX_LISTENERS);
    this.loggingStream.setMaxListeners(this.MAX_LISTENERS);
    this.validationStream.setMaxListeners(this.MAX_LISTENERS);

    this.publisherStream.once('finish', () => {
      this.validationStream.removeAllListeners();
      this.loggingStream.removeAllListeners();
      this.publisherStream.removeAllListeners();
    });

    readable
      .pipe(this.validationStream)
      .pipe(this.loggingStream)
      .pipe(this.publisherStream);

    return 'All events are processed';
  }
}
