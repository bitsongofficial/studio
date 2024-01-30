/*
  Warnings:

  - You are about to drop the column `creator_fee_bps` on the `track_marketplace` table. All the data in the column will be lost.
  - You are about to drop the column `referral_fee_bps` on the `track_marketplace` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."track_marketplace" DROP COLUMN "creator_fee_bps",
DROP COLUMN "referral_fee_bps",
ADD COLUMN     "creator_fee" DOUBLE PRECISION,
ADD COLUMN     "referral_fee" DOUBLE PRECISION;
