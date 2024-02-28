/*
  Warnings:

  - Added the required column `pubkey` to the `multisig_wallets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "multisig"."multisig_wallets" ADD COLUMN     "pubkey" TEXT NOT NULL;
