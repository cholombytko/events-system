import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TiktokEventsService } from './services/tiktok-events.service';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './database/prisma.module';
import { NatsConsumerService } from './services/nats-consumer.service';
import { ConfigModule } from '@nestjs/config';
import { DBWritableStream } from './streams/writable.stream';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [TiktokEventsService, NatsConsumerService, DBWritableStream],
})
export class AppModule {}
