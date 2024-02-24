-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "multisig";

-- CreateTable
CREATE TABLE "multisig"."msig_wallets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "threshold_min" INTEGER NOT NULL,
    "threshold_max" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "msig_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "multisig"."msig_wallet_signers" (
    "id" TEXT NOT NULL,
    "wallet_id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "name" TEXT,
    "address" TEXT NOT NULL,

    CONSTRAINT "msig_wallet_signers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "multisig"."msig_wallet_txs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "memo" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "hash" TEXT,
    "sequence" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "msig_wallet_txs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "multisig"."msig_wallet_tx_signatures" (
    "id" TEXT NOT NULL,
    "tx_id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "body_bytes" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "memo" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "msig_wallet_tx_signatures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "msig_wallets_id_key" ON "multisig"."msig_wallets"("id");

-- CreateIndex
CREATE UNIQUE INDEX "msig_wallet_signers_id_key" ON "multisig"."msig_wallet_signers"("id");

-- CreateIndex
CREATE INDEX "msig_wallet_signers_wallet_id_idx" ON "multisig"."msig_wallet_signers"("wallet_id");

-- CreateIndex
CREATE INDEX "msig_wallet_signers_address_idx" ON "multisig"."msig_wallet_signers"("address");

-- CreateIndex
CREATE UNIQUE INDEX "msig_wallet_txs_id_key" ON "multisig"."msig_wallet_txs"("id");

-- CreateIndex
CREATE INDEX "msig_wallet_txs_hash_idx" ON "multisig"."msig_wallet_txs"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "msig_wallet_tx_signatures_id_key" ON "multisig"."msig_wallet_tx_signatures"("id");

-- CreateIndex
CREATE INDEX "msig_wallet_tx_signatures_tx_id_idx" ON "multisig"."msig_wallet_tx_signatures"("tx_id");

-- CreateIndex
CREATE INDEX "msig_wallet_tx_signatures_address_idx" ON "multisig"."msig_wallet_tx_signatures"("address");

-- AddForeignKey
ALTER TABLE "multisig"."msig_wallet_signers" ADD CONSTRAINT "msig_wallet_signers_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "multisig"."msig_wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "multisig"."msig_wallet_tx_signatures" ADD CONSTRAINT "msig_wallet_tx_signatures_tx_id_fkey" FOREIGN KEY ("tx_id") REFERENCES "multisig"."msig_wallet_txs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
