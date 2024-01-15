/*
  Warnings:

  - You are about to drop the `DropNotification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."DropNotification";

-- CreateTable
CREATE TABLE "public"."DropNotifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "drop_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DropNotifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DropNotifications_id_key" ON "public"."DropNotifications"("id");

-- CreateIndex
CREATE INDEX "DropNotifications_user_id_idx" ON "public"."DropNotifications"("user_id");

-- CreateIndex
CREATE INDEX "DropNotifications_drop_id_idx" ON "public"."DropNotifications"("drop_id");
