-- CreateTable
CREATE TABLE "public"."tracks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tracks_id_key" ON "public"."tracks"("id");

-- CreateIndex
CREATE INDEX "tracks_user_id_idx" ON "public"."tracks"("user_id");
