import prisma from '~/server/utils/db'

interface TopReferral {
  address: string;
  username: string;
  avatar: string;
  unique_users: string;
  total_earned: string;
}

export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({
      message: 'database is not available',
      status: 500
    })
  }

  const result = await prisma.$queryRaw<TopReferral[]>`
        SELECT
          na.referral AS address,
          u.username,
          u.avatar,
          COUNT(DISTINCT na.sender)::text AS unique_users,
          SUM(na.referral_fee) AS total_earned
        FROM
          indexer.nft_activities na
        JOIN
          web3auth."User" u ON na.referral = u.address
        WHERE
          na.timestamp >= CURRENT_DATE - INTERVAL '7 days'
          AND na.referral IS NOT NULL
          AND na.referral_fee IS NOT NULL
        GROUP BY
          na.referral, u.username, u.avatar
        ORDER BY
          total_earned DESC
        LIMIT 15;
    `;

  return result
})