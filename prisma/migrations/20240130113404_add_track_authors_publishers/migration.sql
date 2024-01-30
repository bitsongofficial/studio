-- CreateTable
CREATE TABLE "public"."track_authors_publishers" (
    "id" TEXT NOT NULL,
    "track_id" TEXT NOT NULL,
    "address" TEXT,
    "name" TEXT,
    "role" TEXT,

    CONSTRAINT "track_authors_publishers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "track_authors_publishers_id_key" ON "public"."track_authors_publishers"("id");

-- CreateIndex
CREATE INDEX "track_authors_publishers_track_id_idx" ON "public"."track_authors_publishers"("track_id");

-- AddForeignKey
ALTER TABLE "public"."track_authors_publishers" ADD CONSTRAINT "track_authors_publishers_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
