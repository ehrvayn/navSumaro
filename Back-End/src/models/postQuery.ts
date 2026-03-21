const postQuery = {
  create: (postData: any) => ({
    query: `
      INSERT INTO posts (title, body, tags, type, "groupId", "studentAuthorId", "orgAuthorId")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
    values: [
      postData.title,
      postData.body,
      postData.tags,
      postData.type,
      postData.groupId ?? null,
      postData.studentAuthorId ?? null,
      postData.orgAuthorId ?? null,
    ],
  }),
  retrieveAll: (userId: string, groupId?: string | null) => ({
    query: `
    SELECT 
      p.*,
      CASE 
        WHEN p."studentAuthorId" IS NOT NULL THEN
        json_build_object(
          'id', u.id,
          'firstname', u.firstname,
          'lastname', u.lastname,
          'avatar', u.avatar,
          'accountType', u."accountType",
          'program', u.program,
          'university', u.university,
          'isVerified', u."isVerified",
          'reputation', u.reputation
        )
        WHEN p."orgAuthorId" IS NOT NULL THEN
        json_build_object(
          'id', o.id,
          'name', o.name,
          'avatar', o.avatar,
          'accountType', o."accountType",
          'organizationType', o."organizationType",
          'university', o.university,
          'isVerified', o."isVerified"
        )
      END as author,
      CASE WHEN pv.type = 'up' THEN true ELSE false END AS "upVote",
      CASE WHEN pv.type = 'down' THEN true ELSE false END AS "downVote"
    FROM posts p
    LEFT JOIN users u ON p."studentAuthorId" = u.id
    LEFT JOIN organizations o ON p."orgAuthorId" = o.id
    LEFT JOIN post_votes pv ON pv.post_id = p.id AND pv.user_id = $1
    WHERE ${groupId ? `p."groupId" = $2` : `p."groupId" IS NULL`}
    ORDER BY p."createdAt" DESC;`,
    values: groupId ? [userId, groupId] : [userId],
  }),
  delete: (id: any, userId: any) => ({
    query: `DELETE FROM posts WHERE id = $1 AND ("studentAuthorId" = $2 OR "orgAuthorId" = $2)`,
    values: [id, userId],
  }),
  update: (postData: any) => ({
    query: `
    UPDATE posts
    SET 
      title = $1,
      body = $2,
      tags = $3,
      type = $4
    WHERE id = $5 AND ("studentAuthorId" = $6 OR "orgAuthorId" = $6)
    RETURNING *`,
    values: [
      postData.title,
      postData.body,
      postData.tags,
      postData.type,
      postData.id,
      postData.userId,
    ],
  }),
  getVote: (postId: string, userId: string) => ({
    query: `SELECT type FROM post_votes WHERE post_id = $1 AND user_id = $2`,
    values: [postId, userId],
  }),
  upsertVote: (postId: string, userId: string, type: string) => ({
    query: `
      INSERT INTO post_votes (post_id, user_id, type)
      VALUES ($1, $2, $3)
      ON CONFLICT (post_id, user_id)
      DO UPDATE SET type = EXCLUDED.type`,
    values: [postId, userId, type],
  }),
  deleteVote: (postId: string, userId: string) => ({
    query: `DELETE FROM post_votes WHERE post_id = $1 AND user_id = $2`,
    values: [postId, userId],
  }),
  incrementVote: (postId: string, amount: number) => ({
    query: `UPDATE posts SET votes = votes + $2 WHERE id = $1 RETURNING *`,
    values: [postId, amount],
  }),
};

export default postQuery;