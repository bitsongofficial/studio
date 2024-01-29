-- CreateTable
CREATE TABLE "public"."track_artists" (
    "id" TEXT NOT NULL,
    "track_id" TEXT NOT NULL,
    "address" TEXT,
    "name" TEXT,
    "role" TEXT,

    CONSTRAINT "track_artists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "track_artists_id_key" ON "public"."track_artists"("id");

-- CreateIndex
CREATE INDEX "track_artists_track_id_idx" ON "public"."track_artists"("track_id");

-- AddForeignKey
ALTER TABLE "public"."track_artists" ADD CONSTRAINT "track_artists_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
