import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TiktokEventsService {
  constructor(private readonly prisma: PrismaService) {}

  async insertEvent(data) {
    return this.prisma.tiktokEvent.createMany({
      data,
      skipDuplicates: true,
    });
  }
}
