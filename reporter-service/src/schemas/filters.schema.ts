import { z } from 'zod';
import { FunnelStageSchema } from '../types/event.types';

// Source enum schema
const SourceSchema = z.enum(['facebook', 'tiktok']);

// Base filter schema
const BaseFilterSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  source: SourceSchema.optional(),
});

// Events filter schema
const EventsFilterSchema = BaseFilterSchema.extend({
  funnelStage: FunnelStageSchema.optional(),
  eventType: z.string().optional(), // We'll validate this in the service based on source
});

// Revenue filter schema
// Demographics filter schema
const DemographicsFilterSchema = BaseFilterSchema;

export {
  SourceSchema,
  BaseFilterSchema,
  EventsFilterSchema,
  BaseFilterSchema as RevenueFilterSchema,
  DemographicsFilterSchema,
};
