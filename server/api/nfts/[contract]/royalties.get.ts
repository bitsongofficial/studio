import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const contract = getRouterParam(event, 'contract')

  if (!prisma) {
    throw createError({
      message: 'database is not available',
      status: 500
    })
  }

  const nft = await prisma.nftview.findFirst({
    where: {
      id: contract
    }
  })

  if (!nft) {
    throw createError({
      message: 'nft not found',
      status: 404
    })
  }

  if (!nft.marketplace_address) {
    throw createError({
      message: 'marketplace address not found',
      status: 404
    })
  }

  interface QueryListContributorsResponse {
    data: {
      contributors: {
        address: string
        role: string
        initial_shares: number
        percentage_shares: string
        withdrawable_royalties: string
      }[]
    }
  }

  interface QueryAmountResponse {
    data: string
  }

  const { restAddress } = useRuntimeConfig().public

  const contributorsUrl = `${restAddress}/cosmwasm/wasm/v1/contract/${nft.payment_address}/smart/${btoa(`{"list_contributors":{}}`)}`;
  const withdrawableUrl = `${restAddress}/cosmwasm/wasm/v1/contract/${nft.payment_address}/smart/${btoa(`{"withdrawable_amount":{}}`)}`;
  const distributableUrl = `${restAddress}/cosmwasm/wasm/v1/contract/${nft.payment_address}/smart/${btoa(`{"distributable_amount":{}}`)}`;

  const [contributors, withdrawable, distributable] = await Promise.all([
    $fetch<QueryListContributorsResponse>(contributorsUrl),
    $fetch<QueryAmountResponse>(withdrawableUrl),
    $fetch<QueryAmountResponse>(distributableUrl),
  ]);

  return {
    contributors: contributors.data.contributors.map(contributor => ({
      address: contributor.address,
      role: contributor.role,
      initial_shares: contributor.initial_shares,
      percentage_shares: contributor.percentage_shares,
      withdrawable_royalties: contributor.withdrawable_royalties
    })),
    withdrawable: withdrawable.data,
    distributable: distributable.data
  }
})