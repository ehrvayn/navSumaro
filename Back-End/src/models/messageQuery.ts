const messageQuery = {
  findOrCreateThread: (currentUserId: string, recipientId: string) => ({
    query: `
      INSERT INTO threads ("participantOneId", "participantTwoId")
      VALUES (
        LEAST($1::uuid, $2::uuid),
        GREATEST($1::uuid, $2::uuid)
      )
      ON CONFLICT ("participantOneId", "participantTwoId") DO NOTHING
      RETURNING id
    `,
    values: [currentUserId, recipientId],
  }),

  getExistingThread: (currentUserId: string, recipientId: string) => ({
    query: `
      SELECT id FROM threads
      WHERE "participantOneId" = LEAST($1::uuid, $2::uuid)
      AND "participantTwoId" = GREATEST($1::uuid, $2::uuid)
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
        CASE WHEN t."participantOneId" = $1 THEN t."deletedAtOne" ELSE t."deletedAtTwo" END AS "myDeletedAt",
        CASE WHEN t."participantOneId" = $1 THEN t."unreadOne" ELSE t."unreadTwo" END AS unread,
        u.id AS "participantId",
        u.firstname,
        u.lastname,
        u.avatar,
        u.program,
        u."isOnline"
      FROM threads t
      JOIN users u ON (
        CASE
          WHEN t."participantOneId" = $1 THEN t."participantTwoId"
          ELSE t."participantOneId"
        END = u.id
      )
      WHERE (t."participantOneId" = $1 OR t."participantTwoId" = $1)
      AND (
        (t."participantOneId" = $1 AND (t."deletedAtOne" IS NULL OR EXISTS (
          SELECT 1 FROM messages WHERE "threadId" = t.id AND "createdAt" > t."deletedAtOne"
        )))
        OR
        (t."participantTwoId" = $1 AND (t."deletedAtTwo" IS NULL OR EXISTS (
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
      AND ${isParticipantOne ? '"participantOneId"' : '"participantTwoId"'} = $2
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
        "unreadOne" = CASE WHEN "participantOneId" = $2 THEN "unreadOne" + 1 ELSE "unreadOne" END,
        "unreadTwo" = CASE WHEN "participantTwoId" = $2 THEN "unreadTwo" + 1 ELSE "unreadTwo" END
      WHERE id = $1
    `,
    values: [threadId, recipientId],
  }),

  markAsRead: (threadId: string, userId: string) => ({
    query: `
      UPDATE threads
      SET
        "unreadOne" = CASE WHEN "participantOneId" = $2 THEN 0 ELSE "unreadOne" END,
        "unreadTwo" = CASE WHEN "participantTwoId" = $2 THEN 0 ELSE "unreadTwo" END
      WHERE id = $1
    `,
    values: [threadId, userId],
  }),
};

export default messageQuery;