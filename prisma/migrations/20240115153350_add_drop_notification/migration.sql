-- CreateTable
CREATE TABLE "public"."DropNotification" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "drop_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DropNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DropNotification_id_key" ON "public"."DropNotification"("id");

-- CreateIndex
CREATE INDEX "DropNotification_user_id_idx" ON "public"."DropNotification"("user_id");

-- CreateIndex
CREATE INDEX "DropNotification_drop_id_idx" ON "public"."DropNotification"("drop_id");
