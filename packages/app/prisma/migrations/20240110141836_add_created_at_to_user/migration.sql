/*
  Warnings:

  - You are about to drop the `Episode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Podcast` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Episode" DROP CONSTRAINT "Episode_podcast_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Episode" DROP CONSTRAINT "Episode_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Podcast" DROP CONSTRAINT "Podcast_user_id_fkey";

-- AlterTable
ALTER TABLE "web3auth"."User" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "public"."Episode";

-- DropTable
DROP TABLE "public"."Podcast";

-- DropEnum
DROP TYPE "public"."EpisodeStatus";
