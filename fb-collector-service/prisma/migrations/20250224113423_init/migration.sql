-- CreateEnum
CREATE TYPE "FunnelStage" AS ENUM ('top', 'bottom');

-- CreateEnum
CREATE TYPE "FacebookEventType" AS ENUM ('ad_view', 'page_like', 'comment', 'video_view', 'ad_click', 'form_submission', 'checkout_complete');

-- CreateTable
CREATE TABLE "facebookevent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "timestamp" TIMESTAMP NOT NULL,
    "funnelStage" "FunnelStage" NOT NULL,
    "eventType" "FacebookEventType" NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "facebookevent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "facebookevent_eventId_key" ON "facebookevent"("eventId");
