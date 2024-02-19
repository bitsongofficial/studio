-- CreateTable
CREATE TABLE "public"."music_nfts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleLocale" TEXT NOT NULL,
    "artwork" TEXT NOT NULL,
    "audio" TEXT NOT NULL,

    CONSTRAINT "music_nfts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."music_nft_artists" (
    "id" TEXT NOT NULL,
    "nft_id" TEXT NOT NULL,
    "address" TEXT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "music_nft_artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."music_nft_authors_publishers" (
    "id" TEXT NOT NULL,
    "nft_id" TEXT NOT NULL,
    "address" TEXT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "music_nft_authors_publishers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "music_nfts_id_key" ON "public"."music_nfts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "music_nft_artists_id_key" ON "public"."music_nft_artists"("id");

-- CreateIndex
CREATE INDEX "music_nft_artists_nft_id_idx" ON "public"."music_nft_artists"("nft_id");

-- CreateIndex
CREATE INDEX "music_nft_artists_address_idx" ON "public"."music_nft_artists"("address");

-- CreateIndex
CREATE UNIQUE INDEX "music_nft_authors_publishers_id_key" ON "public"."music_nft_authors_publishers"("id");

-- CreateIndex
CREATE INDEX "music_nft_authors_publishers_nft_id_idx" ON "public"."music_nft_authors_publishers"("nft_id");

-- CreateIndex
CREATE INDEX "music_nft_authors_publishers_address_idx" ON "public"."music_nft_authors_publishers"("address");
