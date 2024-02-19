-- AddForeignKey
ALTER TABLE "public"."music_nft_artists" ADD CONSTRAINT "music_nft_artists_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "public"."music_nfts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."music_nft_authors_publishers" ADD CONSTRAINT "music_nft_authors_publishers_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "public"."music_nfts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
