-- AlterTable
ALTER TABLE "public"."tracks" ADD COLUMN     "artwork_ipfs_cid" TEXT,
ADD COLUMN     "audio_ipfs_cid" TEXT,
ADD COLUMN     "video_ipfs_cid" TEXT;
