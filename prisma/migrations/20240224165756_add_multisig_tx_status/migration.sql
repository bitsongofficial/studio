/*
  Warnings:

  - Added the required column `status` to the `multisig_wallet_txs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wallet_id` to the `multisig_wallet_txs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "multisig"."multisig_tx_status" AS ENUM ('Pending_Signatures', 'Pending_Execution', 'Executed', 'Failed');

-- AlterTable
ALTER TABLE "multisig"."multisig_wallet_txs" ADD COLUMN     "status" "multisig"."multisig_tx_status" NOT NULL,
ADD COLUMN     "wallet_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "multisig_wallet_txs_wallet_id_idx" ON "multisig"."multisig_wallet_txs"("wallet_id");

-- AddForeignKey
ALTER TABLE "multisig"."multisig_wallet_txs" ADD CONSTRAINT "multisig_wallet_txs_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "multisig"."multisig_wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
