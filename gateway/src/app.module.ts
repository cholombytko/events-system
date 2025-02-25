import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NatsService } from './providers/nats-service';
import { ConfigModule } from '@nestjs/config';
import { ValidationStream } from './streams/validation-stream.provider';
import { PublisherStream } from './streams/publisher-stream.provider';
import { LoggingStream } from './streams/logging-stream.provider';
import { MetricsController } from './metrics/metrics.controller';
import { MetricsModule } from './metrics/metrics.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    MetricsModule,
  ],
  controllers: [AppController, MetricsController],
  providers: [
    AppService,
    NatsService,
    ValidationStream,
    PublisherStream,
    LoggingStream,
  ],
})
export class AppModule {}
