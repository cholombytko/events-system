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
  funnelStage: FunnelStageSchema,
  eventType: FacebookEventTypeSchema,
  data: z.object({
    user: FacebookUserSchema,
    engagement: FacebookEngagementSchema,
  }),
});

type FacebookEventType = z.infer<typeof FacebookEventSchema>;

export { FacebookEventSchema, FacebookEventType };
