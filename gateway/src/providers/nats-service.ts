import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  connect,
  NatsConnection,
  JetStreamClient,
  StringCodec,
  JetStreamManager,
  StreamConfig,
  RetentionPolicy,
  StorageType,
} from 'nats';
import { EventType } from '../schemas/event.schema';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private natsConnection: NatsConnection;
  private js: JetStreamClient;
  private jsm: JetStreamManager;
  private sc = StringCodec();
  private streams: string[] = ['facebook', 'tiktok'];
  private readonly SUBJECT_SUFFIX: string = 'events';
  private readonly MAX_MESSAGES = 1000000;

  constructor(
    @InjectPinoLogger(NatsService.name) private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.init();
  }

  async onModuleDestroy() {
    await this.close();
  }

  async init() {
    if (!this.natsConnection) {
      const natsServerUrl = this.configService.get<string>('NATS_SERVER_URL');
      this.natsConnection = await connect({ servers: natsServerUrl });
      this.js = this.natsConnection.jetstream();
      this.jsm = await this.natsConnection.jetstreamManager();
      await this.setupStreams();
    }
  }

  private async setupStreams() {
    const streamConfigs = this.streams.map((streamName) => ({
      name: streamName,
      subjects: [`${streamName}.*`],
      retention: RetentionPolicy.Limits,
      storage: StorageType.File,
      max_msgs: this.MAX_MESSAGES,
    }));

    await Promise.all(
      streamConfigs.map((config) => this.createStreamIfNotExists(config)),
    );
  }

  private async createStreamIfNotExists(config: Partial<StreamConfig>) {
    const exists = await this.streamExists(config.name);
    if (!exists) {
      await this.jsm.streams.add(config);
      this.logger.info(`Stream ${config.name} created`);
    }
  }

  private async streamExists(name: string): Promise<boolean> {
    return this.jsm.streams.info(name).then(
      () => true,
      () => false,
    );
  }

  async publishToStream(streamName: string, event: EventType): Promise<void> {
    try {
      const message = this.sc.encode(JSON.stringify(event));
      const subject = `${streamName}.${this.SUBJECT_SUFFIX}`;
      await this.js.publish(subject, message, { msgID: event.eventId });
      this.logger.info(`Event successfully published to ${streamName} stream.`);
    } catch (error) {
      this.logger.error(`Error publishing to ${streamName}`, error);
    }
  }

  async close() {
    if (this.natsConnection) {
      await this.natsConnection.drain();
      await this.natsConnection.close();
    }
  }
}
