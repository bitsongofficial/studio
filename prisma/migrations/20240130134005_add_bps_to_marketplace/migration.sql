/*
  Warnings:

  - You are about to drop the column `creator_fee` on the `track_marketplace` table. All the data in the column will be lost.
  - You are about to drop the column `referral_fee` on the `track_marketplace` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."track_marketplace" DROP COLUMN "creator_fee",
DROP COLUMN "referral_fee",
ADD COLUMN     "creator_fee_bps" INTEGER,
ADD COLUMN     "referral_fee_bps" INTEGER;
