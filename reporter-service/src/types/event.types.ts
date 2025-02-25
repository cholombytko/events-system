import { z } from 'zod';

// Enum types for FunnelStage and EventType
const FunnelStageSchema = z.enum(['top', 'bottom']);

const FacebookTopEventTypeSchema = z.enum([
  'ad.view',
  'page.like',
  'comment',
  'video.view',
]);
const FacebookBottomEventTypeSchema = z.enum([
  'ad.click',
  'form.submission',
  'checkout.complete',
]);
const FacebookEventTypeSchema = FacebookTopEventTypeSchema.or(
  FacebookBottomEventTypeSchema,
);

const TiktokTopEventTypeSchema = z.enum([
  'video.view',
  'like',
  'share',
  'comment',
]);
const TiktokBottomEventTypeSchema = z.enum([
  'profile.visit',
  'purchase',
  'follow',
]);
const TiktokEventTypeSchema = TiktokTopEventTypeSchema.or(
  TiktokBottomEventTypeSchema,
);

// Facebook User Location schema
const FacebookUserLocationSchema = z.object({
  country: z.string(),
  city: z.string(),
});

// Facebook User schema
const FacebookUserSchema = z.object({
  userId: z.string(),
  name: z.string(),
  age: z.number().positive().int().max(120),
  gender: z.enum(['male', 'female', 'non-binary']),
  location: FacebookUserLocationSchema,
});

// Facebook Engagement schemas
const FacebookEngagementTopSchema = z.object({
  actionTime: z.string().datetime(),
  referrer: z.enum(['newsfeed', 'marketplace', 'groups']),
  videoId: z.string().nullable(),
});

const FacebookEngagementBottomSchema = z.object({
  adId: z.string(),
  campaignId: z.string(),
  clickPosition: z.enum(['top_left', 'bottom_right', 'center']),
  device: z.enum(['mobile', 'desktop']),
  browser: z.enum(['Chrome', 'Firefox', 'Safari']),
  purchaseAmount: z.string().nullable(),
});

const FacebookEngagementSchema = FacebookEngagementTopSchema.or(
  FacebookEngagementBottomSchema,
);

// Facebook Event schema
const FacebookEventSchema = z.object({
  eventId: z.string(),
  timestamp: z.string().datetime(),
  source: z.literal('facebook'),
  funnelStage: FunnelStageSchema,
  eventType: FacebookEventTypeSchema,
  data: z.object({
    user: FacebookUserSchema,
    engagement: FacebookEngagementSchema,
  }),
});

// Tiktok User schema
const TiktokUserSchema = z.object({
  userId: z.string(),
  username: z.string(),
  followers: z.number().min(0).int(),
});

// Tiktok Engagement schemas
const TiktokEngagementTopSchema = z.object({
  watchTime: z.number().positive(),
  percentageWatched: z.number().positive().min(0).max(100),
  device: z.enum(['Android', 'iOS', 'Desktop']),
  country: z.string(),
  videoId: z.string(),
});

const TiktokEngagementBottomSchema = z.object({
  actionTime: z.string().datetime(),
  profileId: z.string().nullable(),
  purchasedItem: z.string().nullable(),
  purchaseAmount: z.string().nullable(),
});

const TiktokEngagementSchema = TiktokEngagementTopSchema.or(
  TiktokEngagementBottomSchema,
);

// Tiktok Event schema
const TiktokEventSchema = z.object({
  eventId: z.string(),
  timestamp: z.string().datetime(),
  source: z.literal('tiktok'),
  funnelStage: FunnelStageSchema,
  eventType: TiktokEventTypeSchema,
  data: z.object({
    user: TiktokUserSchema,
    engagement: TiktokEngagementSchema,
  }),
});

// Event schema (Facebook or Tiktok)
const EventSchema = FacebookEventSchema.or(TiktokEventSchema);

// Type exports
type FunnelStageType = z.infer<typeof FunnelStageSchema>;
type FacebookEventType = z.infer<typeof FacebookEventSchema>;
type TiktokEventType = z.infer<typeof TiktokEventSchema>;
type EventType = z.infer<typeof EventSchema>;

export {
  FunnelStageSchema,
  FacebookTopEventTypeSchema,
  FacebookBottomEventTypeSchema,
  FacebookEventTypeSchema,
  TiktokTopEventTypeSchema,
  TiktokBottomEventTypeSchema,
  TiktokEventTypeSchema,
  FacebookEventSchema,
  TiktokEventSchema,
  EventSchema,
  FunnelStageType,
  FacebookEventType,
  TiktokEventType,
  EventType,
};
