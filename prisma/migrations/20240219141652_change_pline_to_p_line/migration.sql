/*
  Warnings:

  - You are about to drop the column `pline` on the `music_nfts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."music_nfts" DROP COLUMN "pline",
ADD COLUMN     "pLine" TEXT;
