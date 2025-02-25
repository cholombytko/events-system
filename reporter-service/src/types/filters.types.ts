import { z } from 'zod';
import {
  SourceSchema,
  BaseFilterSchema,
  EventsFilterSchema,
  RevenueFilterSchema,
  DemographicsFilterSchema,
} from '../schemas/filters.schema';

// Type exports
type SourceType = z.infer<typeof SourceSchema>;
type BaseFilterType = z.infer<typeof BaseFilterSchema>;
type EventsFilterType = z.infer<typeof EventsFilterSchema>;
type RevenueFilterType = z.infer<typeof RevenueFilterSchema>;
type DemographicsFilterType = z.infer<typeof DemographicsFilterSchema>;

export {
  SourceType,
  BaseFilterType,
  EventsFilterType,
  RevenueFilterType,
  DemographicsFilterType,
};
