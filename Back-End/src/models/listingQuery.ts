const listingQuery = {
  create: (listingData: any, sellerId: any) => ({
    query: `INSERT INTO listings (seller_id, title, description, price, condition, category, images, address)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    values: [
      sellerId,
      listingData.title,
      listingData.description,
      listingData.price,
      listingData.condition,
      listingData.category,
      listingData.images,
      listingData.address,
    ],
  }),
  retrieveAllListings: (limit = 20, offset = 0) => ({
    query: `
    SELECT 
      l.*,
      json_build_object(
        'id', u.id,
        'firstname', u.firstname,
        'lastname', u.lastname,
        'avatar', u.avatar,
        'accountType', u."accountType",
        'program', u.program,
        'university', u.university,
        'isVerified', u."isVerified"
      ) as seller
    FROM listings l
    LEFT JOIN users u ON l.seller_id = u.id
    WHERE l.sold = false
    ORDER BY l.created_at DESC
    LIMIT $1 OFFSET $2
  `,
    values: [limit, offset],
  }),
  getLike: (listingId: string, userId: string) => ({
    query: `SELECT 1 FROM listing_likes WHERE listing_id = $1 AND user_id = $2`,
    values: [listingId, userId],
  }),
  insertLike: (listingId: string, userId: string) => ({
    query: `INSERT INTO listing_likes (listing_id, user_id) VALUES ($1, $2)`,
    values: [listingId, userId],
  }),
  deleteLike: (listingId: string, userId: string) => ({
    query: `DELETE FROM listing_likes WHERE listing_id = $1 AND user_id = $2`,
    values: [listingId, userId],
  }),
  incrementLikes: (listingId: string, amount: number) => ({
    query: `UPDATE listings SET likes = likes + $2 WHERE id = $1 RETURNING *`,
    values: [listingId, amount],
  }),
};

export default listingQuery;
