-- CreateEnum
CREATE TYPE "MetricsTypes" AS ENUM ('accepted_events', 'processed_events', 'failed_events');

-- CreateTable
CREATE TABLE "Metrics" (
    "type" "MetricsTypes" NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "Metrics_type_key" ON "Metrics"("type");
