-- CreateTable
CREATE TABLE "public"."Podcast" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Podcast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Episode" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "audio" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "plays" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "podcast_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Podcast_id_key" ON "public"."Podcast"("id");

-- CreateIndex
CREATE INDEX "Podcast_user_id_idx" ON "public"."Podcast"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Episode_id_key" ON "public"."Episode"("id");

-- CreateIndex
CREATE INDEX "Episode_podcast_id_user_id_idx" ON "public"."Episode"("podcast_id", "user_id");

-- AddForeignKey
ALTER TABLE "public"."Podcast" ADD CONSTRAINT "Podcast_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "web3auth"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Episode" ADD CONSTRAINT "Episode_podcast_id_fkey" FOREIGN KEY ("podcast_id") REFERENCES "public"."Podcast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Episode" ADD CONSTRAINT "Episode_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "web3auth"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
