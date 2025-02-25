/*
  Warnings:

  - Added the required column `source` to the `facebookevent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "facebookevent" ADD COLUMN     "source" TEXT NOT NULL;
