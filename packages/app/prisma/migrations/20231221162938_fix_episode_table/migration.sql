/*
  Warnings:

  - You are about to drop the column `owner` on the `Episode` table. All the data in the column will be lost.
  - Changed the type of `status` on the `Episode` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."EpisodeStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "public"."Episode" DROP COLUMN "owner",
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "image" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."EpisodeStatus" NOT NULL;
