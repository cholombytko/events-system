import { Injectable } from '@nestjs/common';
import {
  DemographicsFilterType,
  EventsFilterType,
  RevenueFilterType,
} from './types/filters.types';
import { PrismaService } from './database/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getEventStatistics(filters: EventsFilterType) {
    const { from, to, funnelStage, source, eventType } = filters;

    const buildFilter = () => {
      const filter: any = {};

      if (from || to) {
        filter.timestamp = {};
        if (from) filter.timestamp.gte = from;
        if (to) filter.timestamp.lte = to;
      }

      if (funnelStage) filter.funnelStage = funnelStage as string;
      if (eventType) filter.eventType = eventType as string;

      return filter;
    };

    const filter = buildFilter();

    let facebookCount = 0;
    let tiktokCount = 0;

    if (source === 'facebook') {
      facebookCount = await this.prisma.facebookEvent.count({
        where: filter,
      });
    } else if (source === 'tiktok') {
      tiktokCount = await this.prisma.tiktokEvent.count({
        where: filter,
      });
    } else {
      [facebookCount, tiktokCount] = await Promise.all([
        this.prisma.facebookEvent.count({
          where: filter,
        }),
        this.prisma.tiktokEvent.count({
          where: filter,
        }),
      ]);
    }

    const totalCount = facebookCount + tiktokCount;

    return totalCount;
  }

  async getRevenueData(filters: RevenueFilterType) {
    const { from, to, source } = filters;

    const buildFilter = () => {
      const filter: any = {};

      if (from || to) {
        filter.timestamp = {};
        if (from) filter.timestamp.gte = from;
        if (to) filter.timestamp.lte = to;
      }
      return filter;
    };

    const filter = buildFilter();

    let facebookRevenue = 0;
    let tiktokRevenue = 0;

    if (source === 'facebook') {
      const facebookEvents = await this.prisma.facebookEvent.findMany({
        where: {
          ...filter,
          eventType: 'checkout.complete',
        },
      });

      facebookRevenue = facebookEvents.reduce((acc, event) => {
        const data = event.data as any; // Type assertion
        const purchaseAmount = data?.engagement?.purchaseAmount;
        if (purchaseAmount) {
          return acc + parseFloat(purchaseAmount);
        }
        return acc;
      }, 0);
    } else if (source === 'tiktok') {
      const tiktokEvents = await this.prisma.tiktokEvent.findMany({
        where: filter,
      });

      tiktokRevenue = tiktokEvents.reduce((acc, event) => {
        const data = event.data as any; // Type assertion
        const purchaseAmount = data?.engagement?.purchaseAmount;
        if (purchaseAmount) {
          return acc + parseFloat(purchaseAmount);
        }
        return acc;
      }, 0);
    } else {
      const [facebookEvents, tiktokEvents] = await Promise.all([
        this.prisma.facebookEvent.findMany({
          where: {
            ...filter,
            eventType: 'checkout.complete',
          },
        }),
        this.prisma.tiktokEvent.findMany({
          where: filter,
        }),
      ]);

      facebookRevenue = facebookEvents.reduce((acc, event) => {
        const data = event.data as any;
        const purchaseAmount = data?.engagement?.purchaseAmount;
        if (purchaseAmount) {
          return acc + parseFloat(purchaseAmount);
        }
        return acc;
      }, 0);

      tiktokRevenue = tiktokEvents.reduce((acc, event) => {
        const data = event.data as any;
        const purchaseAmount = data?.engagement?.purchaseAmount;
        if (purchaseAmount) {
          return acc + parseFloat(purchaseAmount);
        }
        return acc;
      }, 0);
    }

    const total = facebookRevenue + tiktokRevenue;

    return total;
  }

  async getDemographicData(filters: DemographicsFilterType) {
    const { from, to, source } = filters;

    const buildFilter = () => {
      const filter: any = {};

      if (from || to) {
        filter.timestamp = {};
        if (from) filter.timestamp.gte = from;
        if (to) filter.timestamp.lte = to;
      }
      return filter;
    };

    const filter = buildFilter();

    if (source === 'facebook') {
      const facebookData = await this.getFacebookDemographics(filter);
      return facebookData;
    }
    if (source === 'tiktok') {
      const tiktokData = await this.getTiktokDemographics(filter);
      return tiktokData;
    }
    if (source === undefined) {
      const facebookData = await this.getFacebookDemographics(filter);
      const tiktokData = await this.getTiktokDemographics(filter);
      return { facebookData, tiktokData };
    }
  }

  private async getFacebookDemographics(filter: any) {
    const facebookEvents = await this.prisma.facebookEvent.findMany({
      where: filter,
    });

    const ageCounts: { [age: number]: number } = {};
    const genderCounts: { [gender: string]: number } = {};
    const countryCounts: { [country: string]: number } = {};
    const cityCounts: { [city: string]: number } = {};

    facebookEvents.forEach((event) => {
      const data = event.data as any;
      const user = data.user as any;
      const location = user.location as any;

      const age = user.age;
      ageCounts[age] = (ageCounts[age] || 0) + 1;

      const gender = user.gender;
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;

      const { city, country } = location;
      cityCounts[city] = (cityCounts[city] || 0) + 1;
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });

    return { ageCounts, genderCounts, cityCounts, countryCounts };
  }

  private async getTiktokDemographics(filter: any) {
    const tiktokEvents = await this.prisma.tiktokEvent.findMany({
      where: filter,
    });

    const followerCounts: { [followerRange: number]: number } = {};
    const deviceCounts: { [device: string]: number } = {};
    const countryCounts: { [country: string]: number } = {};

    tiktokEvents.forEach((event) => {
      const data = event.data as any;
      const user = data.user as any;
      const engagement = data.engagement as any;
      const followers = user.followers;

      const followerRange = `${Math.floor(followers / 100000) * 100000}-${Math.floor(followers / 100000) * 100000 + 99999}`;
      followerCounts[followerRange] = (followerCounts[followerRange] || 0) + 1;

      const device = engagement.device;
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;

      const country = engagement.country;
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });

    return { followerCounts, deviceCounts, countryCounts };
  }
}
