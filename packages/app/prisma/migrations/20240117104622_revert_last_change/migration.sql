/*
  Warnings:

  - Made the column `user_id` on table `DropNotifications` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."DropNotifications" ALTER COLUMN "user_id" SET NOT NULL;

-- CreateIndex
CREATE INDEX "DropNotifications_user_id_idx" ON "public"."DropNotifications"("user_id");
