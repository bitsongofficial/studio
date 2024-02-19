/*
  Warnings:

  - Added the required column `audio_preview` to the `music_nfts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `music_nfts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `music_nfts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genre` to the `music_nfts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `license` to the `music_nfts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."music_nfts" ADD COLUMN     "audio_preview" TEXT NOT NULL,
ADD COLUMN     "cLine" TEXT,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "explicit" TEXT DEFAULT 'Clean',
ADD COLUMN     "featured" BOOLEAN DEFAULT false,
ADD COLUMN     "genre" TEXT NOT NULL,
ADD COLUMN     "isrc" TEXT,
ADD COLUMN     "iswc" TEXT,
ADD COLUMN     "label" TEXT,
ADD COLUMN     "license" TEXT NOT NULL,
ADD COLUMN     "liveRecording" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lyrics" TEXT,
ADD COLUMN     "lyricsLocale" TEXT,
ADD COLUMN     "pline" TEXT,
ADD COLUMN     "previewDuration" INTEGER DEFAULT 15000,
ADD COLUMN     "previewStartTime" INTEGER DEFAULT 0,
ADD COLUMN     "previousRelease" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "version" TEXT,
ADD COLUMN     "video" TEXT;
