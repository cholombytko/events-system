/*
  Warnings:

  - Changed the type of `funnelStage` on the `facebookevent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `eventType` on the `facebookevent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "facebookevent" DROP COLUMN "funnelStage",
ADD COLUMN     "funnelStage" TEXT NOT NULL,
DROP COLUMN "eventType",
ADD COLUMN     "eventType" TEXT NOT NULL;

-- DropEnum
DROP TYPE "FacebookEventType";

-- DropEnum
DROP TYPE "FunnelStage";
