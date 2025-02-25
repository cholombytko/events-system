import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class FacebookEventsService {
  constructor(private readonly prisma: PrismaService) {}

  async insertEvent(data) {
    return this.prisma.facebookEvent.createMany({
      data,
      skipDuplicates: true,
    });
  }
}
