-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "web3auth";

-- CreateTable
CREATE TABLE "web3auth"."User" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "username" TEXT,
    "avatar" TEXT,
    "cover" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "web3auth"."UserSession" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "active_expires" BIGINT NOT NULL,
    "idle_expires" BIGINT NOT NULL,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "web3auth"."UserKey" (
    "id" TEXT NOT NULL,
    "hashed_password" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "UserKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "web3auth"."User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "web3auth"."User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_id_key" ON "web3auth"."UserSession"("id");

-- CreateIndex
CREATE INDEX "UserSession_user_id_idx" ON "web3auth"."UserSession"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserKey_id_key" ON "web3auth"."UserKey"("id");

-- CreateIndex
CREATE INDEX "UserKey_user_id_idx" ON "web3auth"."UserKey"("user_id");

-- AddForeignKey
ALTER TABLE "web3auth"."UserSession" ADD CONSTRAINT "UserSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "web3auth"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "web3auth"."UserKey" ADD CONSTRAINT "UserKey_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "web3auth"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
