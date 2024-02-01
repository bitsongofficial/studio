import { PrismaClient } from "@prisma/client";
import { useIpfsLink } from "~/composables/useIpfsLink";

export default defineEventHandler(async (event) => {
  const contract = getRouterParam(event, 'contract')

  const nft = await prismaClient.nftview.findUnique({
    where: {
      id: contract
    }
  });

  if (!nft) {
    throw createError({
      message: 'NFT not found',
      status: 404
    })
  }

  interface NftStats {
    editions: string;
    owners: string;
  }

  const prismaClient = new PrismaClient();
  const stats = await prismaClient.$queryRaw<NftStats[]>`
      SELECT 
          COUNT(*)::text AS editions, 
          COUNT(DISTINCT owner)::text AS owners
      FROM
          indexer.nft_tokens
      WHERE
          nft_id = ${contract}
      LIMIT 1;
      `;

  let metadata;

  if (nft.uri) {
    try {
      const response = await $fetch(useIpfsLink(nft.uri)!);
      metadata = response
    } catch (error) {
      console.log(error);
    }
  }

  return {
    ...nft,
    editions: stats.length > 0 ? parseInt(stats[0].editions) : 0,
    owners: stats.length > 0 ? parseInt(stats[0].owners) : 0,
    metadata
  }
})