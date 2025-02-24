import { Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { FacebookEvent } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async insertEvent(data): Promise<FacebookEvent> {
    return this.prisma.facebookEvent.create({
      data,
    });
  }
}
