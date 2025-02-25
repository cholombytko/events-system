import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(
    @InjectPinoLogger(PrismaService.name) private readonly logger: PinoLogger,
  ) {
    super();
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.info('Connected to the database');
    } catch (error) {
      this.logger.fatal('Failed connect to db');
      this.logger.error({ error });
      process.exit(1);
    }
  }
}
