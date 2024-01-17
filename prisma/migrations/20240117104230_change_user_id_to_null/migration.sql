-- DropIndex
DROP INDEX "public"."DropNotifications_user_id_idx";

-- AlterTable
ALTER TABLE "public"."DropNotifications" ALTER COLUMN "user_id" DROP NOT NULL;
