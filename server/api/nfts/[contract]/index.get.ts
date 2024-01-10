import { PrismaClient } from "@prisma/client";
import { useIpfsLink } from "~/composables/useIpfsLink";

const prismaClient = new PrismaClient();

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
    metadata
  }
})