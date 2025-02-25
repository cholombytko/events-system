-- CreateTable
CREATE TABLE "facebookevent" (
    "eventId" TEXT NOT NULL,
    "timestamp" TIMESTAMP NOT NULL,
    "source" TEXT NOT NULL,
    "funnelStage" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "facebookevent_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "tiktokevent" (
    "eventId" TEXT NOT NULL,
    "timestamp" TIMESTAMP NOT NULL,
    "source" TEXT NOT NULL,
    "funnelStage" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "tiktokevent_pkey" PRIMARY KEY ("eventId")
);

-- CreateIndex
CREATE UNIQUE INDEX "facebookevent_eventId_key" ON "facebookevent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "tiktokevent_eventId_key" ON "tiktokevent"("eventId");
