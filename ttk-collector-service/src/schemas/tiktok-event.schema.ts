import { z } from 'zod';

// Enum types for FunnelStage and EventType
const FunnelStageSchema = z.enum(['top', 'bottom']);

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

type TiktokEventType = z.infer<typeof TiktokEventSchema>;

export { TiktokEventSchema, TiktokEventType };
