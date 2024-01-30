-- CreateTable
CREATE TABLE "public"."track_royalties_info" (
    "id" TEXT NOT NULL,
    "track_id" TEXT NOT NULL,
    "address" TEXT,
    "name" TEXT,
    "role" TEXT,

    CONSTRAINT "track_royalties_info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "track_royalties_info_id_key" ON "public"."track_royalties_info"("id");

-- CreateIndex
CREATE INDEX "track_royalties_info_track_id_idx" ON "public"."track_royalties_info"("track_id");

-- AddForeignKey
ALTER TABLE "public"."track_royalties_info" ADD CONSTRAINT "track_royalties_info_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
