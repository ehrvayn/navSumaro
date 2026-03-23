const messageQuery = {
  findOrCreateThread: (
    currentUserId: string,
    recipientId: string,
    currentUserIsOrg = false,
    recipientIsOrg = false,
  ) => ({
    query: `
      INSERT INTO threads (
        "participantOneId", "participantTwoId",
        "orgParticipantOneId", "orgParticipantTwoId"
      )
      SELECT
        ${currentUserIsOrg ? "NULL" : "$1::uuid"},
        ${recipientIsOrg ? "NULL" : "$2::uuid"},
        ${currentUserIsOrg ? "$1::uuid" : "NULL"},
        ${recipientIsOrg ? "$2::uuid" : "NULL"}
      WHERE NOT EXISTS (
        SELECT 1 FROM threads WHERE
          ("participantOneId" = LEAST($1::uuid, $2::uuid) AND "participantTwoId" = GREATEST($1::uuid, $2::uuid))
          OR ("orgParticipantOneId" = $1::uuid AND "participantTwoId" = $2::uuid)
          OR ("participantOneId" = $1::uuid AND "orgParticipantTwoId" = $2::uuid)
          OR ("orgParticipantOneId" = $1::uuid AND "orgParticipantTwoId" = $2::uuid)
      )
      RETURNING id
    `,
    values: [currentUserId, recipientId],
  }),

  getExistingThread: (currentUserId: string, recipientId: string) => ({
    query: `
      SELECT id FROM threads WHERE
        ("participantOneId" = LEAST($1::uuid, $2::uuid) AND "participantTwoId" = GREATEST($1::uuid, $2::uuid))
        OR ("orgParticipantOneId" = $1::uuid AND "participantTwoId" = $2::uuid)
        OR ("participantOneId" = $1::uuid AND "orgParticipantTwoId" = $2::uuid)
        OR ("orgParticipantOneId" = $1::uuid AND "orgParticipantTwoId" = $2::uuid)
    `,
    values: [currentUserId, recipientId],
  }),

  sendMessage: (threadId: string, senderId: string, text: string) => ({
    query: `
      INSERT INTO messages ("threadId", "senderId", text, seen)
      VALUES ($1, $2, $3, false)
      RETURNING *
    `,
    values: [threadId, senderId, text],
  }),

  updateLastMessage: (threadId: string, text: string) => ({
    query: `UPDATE threads SET "lastMessage" = $1, "updatedAt" = NOW() WHERE id = $2`,
    values: [text, threadId],
  }),

  retrieveAll: (threadId: string, deletedAt: string | null) => ({
    query: deletedAt
      ? `SELECT * FROM messages WHERE "threadId" = $1 AND "createdAt" > $2 ORDER BY "createdAt" ASC`
      : `SELECT * FROM messages WHERE "threadId" = $1 ORDER BY "createdAt" ASC`,
    values: deletedAt ? [threadId, deletedAt] : [threadId],
  }),

  getThreads: (userId: string) => ({
    query: `
      SELECT
        t.id,
        t."lastMessage",
        t."createdAt",
        t."updatedAt",
        CASE
          WHEN t."participantOneId" = $1 OR t."orgParticipantOneId" = $1 THEN t."unreadOne"
          ELSE t."unreadTwo"
        END AS unread,
        COALESCE(u.id, o.id) AS "participantId",
        COALESCE(u.firstname, o.name) AS firstname,
        COALESCE(u.lastname, '') AS lastname,
        COALESCE(u.avatar, o.avatar) AS avatar,
        COALESCE(u.program, o."organizationType") AS program,
        COALESCE(u."isOnline", false) AS "isOnline",
        CASE WHEN o.id IS NOT NULL THEN 'organization' ELSE 'student' END AS "accountType"
      FROM threads t
      LEFT JOIN users u ON (
        CASE
          WHEN t."participantOneId" = $1 OR t."orgParticipantOneId" = $1 THEN t."participantTwoId"
          ELSE t."participantOneId"
        END = u.id
      )
      LEFT JOIN organizations o ON (
        CASE
          WHEN t."participantOneId" = $1 OR t."orgParticipantOneId" = $1 THEN t."orgParticipantTwoId"
          ELSE t."orgParticipantOneId"
        END = o.id
      )
      WHERE (
        t."participantOneId" = $1 OR t."participantTwoId" = $1
        OR t."orgParticipantOneId" = $1 OR t."orgParticipantTwoId" = $1
      )
      AND (
        ((t."participantOneId" = $1 OR t."orgParticipantOneId" = $1) AND (t."deletedAtOne" IS NULL OR EXISTS (
          SELECT 1 FROM messages WHERE "threadId" = t.id AND "createdAt" > t."deletedAtOne"
        )))
        OR
        ((t."participantTwoId" = $1 OR t."orgParticipantTwoId" = $1) AND (t."deletedAtTwo" IS NULL OR EXISTS (
          SELECT 1 FROM messages WHERE "threadId" = t.id AND "createdAt" > t."deletedAtTwo"
        )))
      )
      ORDER BY COALESCE(t."updatedAt", t."createdAt") DESC
    `,
    values: [userId],
  }),

  getThread: (threadId: string) => ({
    query: `SELECT * FROM threads WHERE id = $1`,
    values: [threadId],
  }),

  deleteThread: (threadId: string, currentUserId: string, isParticipantOne: boolean) => ({
    query: `
      UPDATE threads
      SET ${isParticipantOne ? '"deletedAtOne"' : '"deletedAtTwo"'} = NOW()
      WHERE id = $1
      AND (${isParticipantOne
        ? '"participantOneId" = $2 OR "orgParticipantOneId" = $2'
        : '"participantTwoId" = $2 OR "orgParticipantTwoId" = $2'})
    `,
    values: [threadId, currentUserId],
  }),

  clearDeletedAt: (threadId: string, isParticipantOne: boolean) => ({
    query: `
      UPDATE threads
      SET ${isParticipantOne ? '"deletedAtOne"' : '"deletedAtTwo"'} = NULL
      WHERE id = $1
    `,
    values: [threadId],
  }),

  incrementUnread: (threadId: string, recipientId: string) => ({
    query: `
      UPDATE threads
      SET
        "unreadOne" = CASE WHEN "participantOneId" = $2 OR "orgParticipantOneId" = $2 THEN "unreadOne" + 1 ELSE "unreadOne" END,
        "unreadTwo" = CASE WHEN "participantTwoId" = $2 OR "orgParticipantTwoId" = $2 THEN "unreadTwo" + 1 ELSE "unreadTwo" END
      WHERE id = $1
    `,
    values: [threadId, recipientId],
  }),

  markAsRead: (threadId: string, userId: string) => ({
    query: `
      UPDATE threads
      SET
        "unreadOne" = CASE WHEN "participantOneId" = $2 OR "orgParticipantOneId" = $2 THEN 0 ELSE "unreadOne" END,
        "unreadTwo" = CASE WHEN "participantTwoId" = $2 OR "orgParticipantTwoId" = $2 THEN 0 ELSE "unreadTwo" END
      WHERE id = $1
    `,
    values: [threadId, userId],
  }),
};

export default messageQuery;