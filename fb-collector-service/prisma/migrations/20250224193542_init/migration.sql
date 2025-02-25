/*
  Warnings:

  - The primary key for the `facebookevent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `facebookevent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "facebookevent" DROP CONSTRAINT "facebookevent_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "facebookevent_pkey" PRIMARY KEY ("eventId");
