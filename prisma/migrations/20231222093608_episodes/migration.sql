/*
  Warnings:

  - You are about to drop the column `audio` on the `Episode` table. All the data in the column will be lost.
  - You are about to drop the column `format` on the `Episode` table. All the data in the column will be lost.
  - Added the required column `audio_original` to the `Episode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content_type` to the `Episode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Episode" DROP COLUMN "audio",
DROP COLUMN "format",
ADD COLUMN     "audio_original" TEXT NOT NULL,
ADD COLUMN     "content_type" TEXT NOT NULL;
