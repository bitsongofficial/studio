/*
  Warnings:

  - You are about to drop the `msig_wallet_signers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `msig_wallet_tx_signatures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `msig_wallet_txs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `msig_wallets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "multisig"."msig_wallet_signers" DROP CONSTRAINT "msig_wallet_signers_wallet_id_fkey";

-- DropForeignKey
ALTER TABLE "multisig"."msig_wallet_tx_signatures" DROP CONSTRAINT "msig_wallet_tx_signatures_tx_id_fkey";

-- DropTable
DROP TABLE "multisig"."msig_wallet_signers";

-- DropTable
DROP TABLE "multisig"."msig_wallet_tx_signatures";

-- DropTable
DROP TABLE "multisig"."msig_wallet_txs";

-- DropTable
DROP TABLE "multisig"."msig_wallets";

-- CreateTable
CREATE TABLE "multisig"."multisig_wallets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "threshold" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "multisig_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "multisig"."multisig_wallet_members" (
    "id" TEXT NOT NULL,
    "wallet_id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "name" TEXT,
    "address" TEXT NOT NULL,

    CONSTRAINT "multisig_wallet_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "multisig"."multisig_wallet_txs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "memo" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "hash" TEXT,
    "sequence" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "multisig_wallet_txs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "multisig"."multisig_wallet_tx_signatures" (
    "id" TEXT NOT NULL,
    "tx_id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "body_bytes" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "memo" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "multisig_wallet_tx_signatures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "multisig_wallets_id_key" ON "multisig"."multisig_wallets"("id");

-- CreateIndex
CREATE UNIQUE INDEX "multisig_wallet_members_id_key" ON "multisig"."multisig_wallet_members"("id");

-- CreateIndex
CREATE INDEX "multisig_wallet_members_wallet_id_idx" ON "multisig"."multisig_wallet_members"("wallet_id");

-- CreateIndex
CREATE INDEX "multisig_wallet_members_address_idx" ON "multisig"."multisig_wallet_members"("address");

-- CreateIndex
CREATE UNIQUE INDEX "multisig_wallet_txs_id_key" ON "multisig"."multisig_wallet_txs"("id");

-- CreateIndex
CREATE INDEX "multisig_wallet_txs_hash_idx" ON "multisig"."multisig_wallet_txs"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "multisig_wallet_tx_signatures_id_key" ON "multisig"."multisig_wallet_tx_signatures"("id");

-- CreateIndex
CREATE INDEX "multisig_wallet_tx_signatures_tx_id_idx" ON "multisig"."multisig_wallet_tx_signatures"("tx_id");

-- CreateIndex
CREATE INDEX "multisig_wallet_tx_signatures_address_idx" ON "multisig"."multisig_wallet_tx_signatures"("address");

-- AddForeignKey
ALTER TABLE "multisig"."multisig_wallet_members" ADD CONSTRAINT "multisig_wallet_members_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "multisig"."multisig_wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "multisig"."multisig_wallet_tx_signatures" ADD CONSTRAINT "multisig_wallet_tx_signatures_tx_id_fkey" FOREIGN KEY ("tx_id") REFERENCES "multisig"."multisig_wallet_txs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
