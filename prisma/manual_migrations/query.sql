CREATE VIEW public.NftTokenView AS
SELECT
    nt.nft_id,
    n.name AS nft_name,
    n.image AS nft_image,
    nt.token_id,
    nt.owner
FROM
    indexer.nft_tokens nt
JOIN
    indexer.nfts n ON nt.nft_id = n.id;

CREATE VIEW public.NftView AS
SELECT 
    n.id,
    n.block_height,
    n.tx_hash,
    n.symbol,
    n.name,
    n.image,
    n.animation_url,
    n.uri,
    n.payment_denom,
    n.payment_address,
    n.max_per_address,
    n.seller_fee_bps,
    n.referral_fee_bps,
    n.start_time,
    n.sale_type,
    n.marketplace_address,
    n.ratio,
    n.sender,
    n.timestamp,
    COALESCE(SUM(a.total_price), 0) AS volume,
    COALESCE((
        SELECT a2.total_price
        FROM indexer.nft_activities a2
        WHERE a2.nft_id = n.id
        ORDER BY a2.timestamp DESC
        LIMIT 1
    ), 0) AS last_price
FROM 
    indexer.nfts n
LEFT JOIN 
    indexer.nft_activities a ON n.id = a.nft_id
GROUP BY 
    n.id;

CREATE VIEW public.NftActivityView AS
SELECT * FROM indexer.nft_activities;