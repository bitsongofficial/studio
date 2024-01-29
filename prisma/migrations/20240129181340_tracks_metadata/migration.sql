-- AlterTable
ALTER TABLE "public"."tracks" ADD COLUMN     "country" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "explicit" TEXT DEFAULT 'Clean',
ADD COLUMN     "genre" TEXT,
ADD COLUMN     "license" TEXT,
ADD COLUMN     "liveRecording" BOOLEAN DEFAULT false,
ADD COLUMN     "lyrics" TEXT,
ADD COLUMN     "lyricsLocale" TEXT,
ADD COLUMN     "previewDuration" INTEGER DEFAULT 15000,
ADD COLUMN     "previewStartTime" INTEGER DEFAULT 0,
ADD COLUMN     "previousRelease" BOOLEAN DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
