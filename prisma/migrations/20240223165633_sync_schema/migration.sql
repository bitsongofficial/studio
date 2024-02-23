-- AddForeignKey
ALTER TABLE "public"."tracks" ADD CONSTRAINT "tracks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "web3auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
