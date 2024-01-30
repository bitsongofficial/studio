-- CreateTable
CREATE TABLE "public"."track_marketplace" (
    "id" TEXT NOT NULL,
    "track_id" TEXT NOT NULL,
    "ratio" INTEGER,
    "creator_fee" INTEGER,
    "referral_fee" INTEGER,

    CONSTRAINT "track_marketplace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "track_marketplace_id_key" ON "public"."track_marketplace"("id");

-- CreateIndex
CREATE INDEX "track_marketplace_track_id_idx" ON "public"."track_marketplace"("track_id");

-- AddForeignKey
ALTER TABLE "public"."track_marketplace" ADD CONSTRAINT "track_marketplace_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
