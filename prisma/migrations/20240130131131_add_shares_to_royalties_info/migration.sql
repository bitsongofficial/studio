/*
  Warnings:

  - You are about to drop the column `name` on the `track_royalties_info` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."track_royalties_info" DROP COLUMN "name",
ADD COLUMN     "shares" INTEGER;
