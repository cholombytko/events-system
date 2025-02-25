import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  connect,
  NatsConnection,
  JetStreamClient,
  JetStreamManager,
  ConsumerConfig,
  AckPolicy,
  DeliverPolicy,
} from 'nats';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { DBWritableStream } from '../streams/writable.stream';
import { Readable } from 'stream';

@Injectable()
export class NatsConsumerService implements OnModuleInit, OnModuleDestroy {
  private natsConnection: NatsConnection;
  private js: JetStreamClient;
  private jsm: JetStreamManager;
  private readonly streamName = 'tiktok';
  private readonly subjectName = `${this.streamName}.events`;
  private readonly durableName = `${this.streamName}-consumer`;
  private readonly ACK_WAIT_TIME = 30 * 1000 * 1000 * 1000;
  private readonly MAX_DELIVER_QUANTITY = 3;

  constructor(
    @InjectPinoLogger(NatsConsumerService.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
    private readonly dbWritableStream: DBWritableStream,
  ) {}

  async onModuleInit() {
    await this.connect();
    await this.setupConsumer();
    await this.processMessages();
  }

  async onModuleDestroy() {
    await this.close();
  }

  private async connect() {
    const natsServerUrl = this.configService.get<string>('NATS_SERVER_URL');
    this.natsConnection = await connect({ servers: natsServerUrl });
    this.js = this.natsConnection.jetstream();
    this.jsm = await this.natsConnection.jetstreamManager();
    this.logger.info(`Connected to NATS server for ${this.streamName} consumer`);
  }

  private async setupConsumer() {
    try {
      await this.jsm.streams.info(this.streamName).catch(() => {
        this.logger.error(`Stream ${this.streamName} does not exist`);
        return;
      });

      const consumerConfig: Partial<ConsumerConfig> = {
        durable_name: this.durableName,
        ack_policy: AckPolicy.Explicit,
        deliver_policy: DeliverPolicy.All,
        ack_wait: this.ACK_WAIT_TIME,
        max_deliver: this.MAX_DELIVER_QUANTITY,
      };

      try {
        await this.jsm.consumers.info(this.streamName, this.durableName);
        this.logger.info(`Consumer ${this.durableName} already exists`);
      } catch {
        await this.jsm.consumers.add(this.streamName, consumerConfig);
        this.logger.info(`Consumer ${this.durableName} created`);
      }

      this.logger.info(
        `${this.streamName} consumer setup complete for ${this.subjectName}`,
      );
    } catch (error) {
      this.logger.error(`Error setting up ${this.streamName} consumer:`, error);
    }
  }

  private async processMessages() {
    const consumer = await this.js.consumers.get(
      this.streamName,
      this.durableName,
    );

    const iter = await consumer.consume();

    const readable = Readable.from(iter, { objectMode: true });

    readable.pipe(this.dbWritableStream);
  }

  async close() {
    if (this.natsConnection) {
      await this.natsConnection.drain();
      await this.natsConnection.close();
      this.logger.info(`${this.streamName} NATS connection closed`);
    }
  }
}
