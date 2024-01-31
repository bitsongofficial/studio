-- AlterTable
ALTER TABLE "public"."tracks" ADD COLUMN     "video_bit_rate" INTEGER,
ADD COLUMN     "video_duration" INTEGER,
ADD COLUMN     "video_format" TEXT,
ADD COLUMN     "video_mime_type" TEXT,
ADD COLUMN     "video_size" INTEGER;
