/*
  Warnings:

  - You are about to drop the column `data` on the `multisig_wallet_txs` table. All the data in the column will be lost.
  - Added the required column `fee` to the `multisig_wallet_txs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `msgs` to the `multisig_wallet_txs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "multisig"."multisig_wallet_txs" DROP COLUMN "data",
ADD COLUMN     "fee" TEXT NOT NULL,
ADD COLUMN     "msgs" TEXT NOT NULL;
