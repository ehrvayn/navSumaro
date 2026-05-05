const groupQuery = {
  create: (groupData: any, userId: string) => ({
    query: `
      INSERT INTO groups (name, description, subject, university, course, emoji, "isPublic", tags, "managedBy")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
    values: [
      groupData.name,
      groupData.description,
      groupData.subject,
      groupData.university,
      groupData.course,
      groupData.emoji,
      groupData.isPublic ?? true,
      groupData.tags ?? [],
      userId,
    ],
  }),
  addMember: (groupId: string, userId: string, isAdmin: boolean) => ({
    query: `INSERT INTO group_members (group_id, user_id, "isAdmin") VALUES ($1, $2, $3)`,
    values: [groupId, userId, isAdmin],
  }),
  retrieveAll: (userId: string) => ({
    query: `
  SELECT 
    g.*,
    CASE WHEN gm_user.user_id IS NOT NULL THEN true ELSE false END AS joined,
    gjr_user.status AS "requestStatus",
    COALESCE(
      json_agg(
        json_build_object(
          'user', json_build_object(
            'id', u.id,
            'firstname', u.firstname,
            'lastname', u.lastname,
            'avatar', u.avatar,
            'program', u.program,
            'accountType', u."accountType",
            'isOnline', false,
            'isVerified', u."isVerified"
          ),
          'isAdmin', gm."isAdmin",
          'joinedAt', gm.joined_at
        )
      ) FILTER (WHERE gm.user_id IS NOT NULL), '[]'
    ) as members
  FROM groups g
  LEFT JOIN group_members gm ON gm.group_id = g.id
  LEFT JOIN users u ON u.id = gm.user_id
  LEFT JOIN group_members gm_user ON gm_user.group_id = g.id AND gm_user.user_id = $1
  LEFT JOIN group_join_requests gjr_user ON gjr_user.group_id = g.id AND gjr_user.user_id = $1
  GROUP BY g.id, gm_user.user_id, gjr_user.status
  ORDER BY g."createdAt" DESC`,
    values: [userId],
  }),
  editGroup: (groupData: any) => ({
    query: `
    UPDATE groups
    SET
      name = $1,
      description = $2,
      subject = $3,
      university = $4,
      course = $5,
      emoji = $6,
      "isPublic" = $7,
      tags = $8
    WHERE id = $9
    RETURNING *`,
    values: [
      groupData.name,
      groupData.description,
      groupData.subject,
      groupData.university,
      groupData.course,
      groupData.emoji,
      groupData.isPublic,
      groupData.tags,
      groupData.id,
    ],
  }),
  removeMember: (groupId: string, userId: string) => ({
    query: `DELETE FROM group_members WHERE group_id = $1 AND user_id = $2`,
    values: [groupId, userId],
  }),
  sendMessage: (groupId: string, senderId: string, text: string) => ({
    query: `
      INSERT INTO group_messages ("groupId", "senderId", text)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
    values: [groupId, senderId, text],
  }),

  getMessages: (groupId: string) => ({
    query: `
    SELECT 
      gm.*,
      u.firstname,
      u.lastname,
      u.avatar
    FROM group_messages gm
    LEFT JOIN users u ON u.id = gm."senderId"
    WHERE gm."groupId" = $1
    ORDER BY gm."createdAt" ASC
  `,
    values: [groupId],
  }),

  markAsRead: (groupId: string, userId: string) => ({
    query: `
      INSERT INTO group_unread ("groupId", "userId", unread)
      VALUES ($1, $2, 0)
      ON CONFLICT ("groupId", "userId") 
      DO UPDATE SET unread = 0
    `,
    values: [groupId, userId],
  }),

  incrementUnread: (groupId: string) => ({
    query: `
      UPDATE group_unread
      SET unread = unread + 1
      WHERE "groupId" = $1
    `,
    values: [groupId],
  }),

  getGroupUnread: (groupId: string, userId: string) => ({
    query: `
      SELECT unread FROM group_unread
      WHERE "groupId" = $1 AND "userId" = $2
    `,
    values: [groupId, userId],
  }),

  requestJoin: (userId: string, groupId: string) => ({
    query: `INSERT INTO group_join_requests (user_id, group_id, status) VALUES ($1, $2, 'pending') RETURNING id`,
    values: [userId, groupId],
  }),

  getJoinRequests: (groupId: string) => ({
    query: `
    SELECT 
      gjr.id,
      gjr.group_id,
      gjr.status,
      gjr.created_at,
      u.id AS user_id,
      u.firstname,
      u.lastname,
      u.program
    FROM group_join_requests gjr
    INNER JOIN users u ON u.id = gjr.user_id
    WHERE gjr.group_id = $1 AND gjr.status = 'pending'
  `,
    values: [groupId],
  }),

  acceptRequest: (groupId: string, userId: string) => ({
    query: `DELETE FROM group_join_requests WHERE user_id = $1 AND group_id = $2`,
    values: [userId, groupId],
  }),

  checkIsAdmin: (groupId: string, userId: string) => ({
    query: `SELECT "isAdmin" FROM group_members WHERE group_id = $1 AND user_id = $2`,
    values: [groupId, userId],
  }),

  canceJoinRequest: (userId: string, groupId: string) => ({
    query: `DELETE FROM group_join_requests WHERE user_id = $1 AND group_id = $2`,
    values: [userId, groupId],
  }),
  rejectJoinRequest: (userId: string, groupId: string) => ({
    query: `DELETE FROM group_join_requests WHERE user_id = $1 AND group_id = $2`,
    values: [userId, groupId],
  }),
};

export default groupQuery;
