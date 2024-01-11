import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

interface TopTrader {
  address: string;
  username: string;
  avatar: string;
  mints: number;
  burns: number;
  volume: number;
}

export default defineEventHandler(async (event) => {
  const result = await prismaClient.$queryRaw<TopTrader[]>`
        SELECT
          na.sender AS address,
          u.username,
          u.avatar,
          COUNT(*) FILTER (WHERE na.side = 'buy')::text AS mints,
          COUNT(*) FILTER (WHERE na.side = 'sell')::text AS burns,
          SUM(na.total_price) AS volume
        FROM
          indexer.nft_activities na
        JOIN
          web3auth."User" u ON na.sender = u.address
        GROUP BY
          na.sender, u.username, u.avatar
        ORDER BY
          volume DESC
        LIMIT 15;
    `;

  return result
})