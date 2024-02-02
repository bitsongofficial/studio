-- CreateEnum
CREATE TYPE "public"."TrackStatus" AS ENUM ('Draft', 'To_Mint', 'Minted');

-- AlterTable
ALTER TABLE "public"."tracks" ADD COLUMN     "status" "public"."TrackStatus" NOT NULL DEFAULT 'Draft';
