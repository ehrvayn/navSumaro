const commentQuery = {
  create: (commentData: any, userId: string) => ({
    query: `
      INSERT INTO comments (post_id, parent_id, author_id, text)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
    values: [
      commentData.postId,
      commentData.parentId ?? null,
      userId,
      commentData.text,
    ],
  }),
  delete: (id: any, userId: any) => ({
    query: `DELETE FROM comments WHERE id = $1 AND author_id = $2`,
    values: [id, userId],
  }),
  incrementCount: (postId: string) => ({
    query: `UPDATE posts SET comments = comments + 1 WHERE id = $1`,
    values: [postId],
  }),
  retrieveAll: (postId: string, userId: string) => ({
    query: `
    SELECT 
      c.*,
      json_build_object(
        'id', u.id,
        'firstname', u.firstname,
        'lastname', u.lastname,
        'avatar', u.avatar,
        'accountType', u."accountType",
        'program', u.program,
        'isOnline', false,
        'isVerified', u."isVerified"
      ) as author,
      CASE WHEN cl.user_id IS NOT NULL THEN true ELSE false END AS "liked"
    FROM comments c
    JOIN users u ON c.author_id = u.id
    LEFT JOIN comment_likes cl ON cl.comment_id = c.id AND cl.user_id = $2
    WHERE c.post_id = $1
    ORDER BY c.time DESC`,
    values: [postId, userId],
  }),
  getLike: (commentId: string, userId: string) => ({
    query: `SELECT 1 FROM comment_likes WHERE comment_id = $1 AND user_id = $2`,
    values: [commentId, userId],
  }),
  insertLike: (commentId: string, userId: string) => ({
    query: `INSERT INTO comment_likes (comment_id, user_id) VALUES ($1, $2)`,
    values: [commentId, userId],
  }),
  deleteLike: (commentId: string, userId: string) => ({
    query: `DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2`,
    values: [commentId, userId],
  }),
  incrementLikes: (commentId: string, amount: number) => ({
    query: `UPDATE comments SET likes = likes + $2 WHERE id = $1 RETURNING *`,
    values: [commentId, amount],
  }),
};

export default commentQuery;
