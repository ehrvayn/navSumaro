const usersQuery = {
  create: (userData: any) => ({
    query: `
    INSERT INTO users ("accountType", firstname, lastname, email, password, university, program, "yearLevel", avatar, "isVerified") 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
    RETURNING 
    id, "accountType", firstname, lastname, email, 
    university, program, "yearLevel", avatar, "isVerified", created_at
  `,
    values: [
      userData.accountType,
      userData.firstname,
      userData.lastname,
      userData.email,
      userData.password,
      userData.university,
      userData.program,
      userData.yearLevel,
      userData.avatar,
      userData.isVerified ?? false,
    ],
  }),
  login: (email: string) => ({
    query: `
    SELECT id, email, password, "accountType", firstname, lastname, program, avatar, "isVerified"
    FROM users WHERE email = $1
  `,
    values: [email],
  }),
  retrieveWithBadges: (id: any) => ({
    query: `
    SELECT u.id, u.email, u.firstname, u.lastname, u."accountType", 
           u.university, u.program, u."yearLevel", u.avatar, 
           u.reputation, u."isVerified", u.created_at,
           COALESCE(json_agg(b.*) FILTER (WHERE b.id IS NOT NULL), '[]') as badges
    FROM users u
    LEFT JOIN user_badges ub ON u.id = ub.user_id
    LEFT JOIN badges b ON ub.badge_id = b.id
    WHERE u.id = $1
    GROUP BY u.id`,
    values: [id],
  }),
  assignBadge: (userId: any, badgeId: any) => ({
    query: `INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    values: [userId, badgeId],
  }),
  getVerifiedBadge: () => ({
    query: `SELECT id FROM badges WHERE label = 'Verified'`,
    values: [],
  }),
  delete: (id: any) => ({
    query: "DELETE FROM users WHERE id = $1",
    values: [id],
  }),
  retrieve: (email: string) => ({
    query: `SELECT 
      id, 
      email, 
      firstname, 
      lastname, 
      "accountType", 
      university, 
      program, 
      "yearLevel", 
      avatar,
      created_at
    FROM users WHERE email = $1`,
    values: [email],
  }),
  retrieveById: (id: any) => ({
    query: `
    SELECT 
      id, 
      email, 
      firstname, 
      lastname, 
      "accountType", 
      university, 
      program, 
      "yearLevel", 
      avatar,
      created_at
    FROM users 
    WHERE id = $1
  `,
    values: [id],
  }),

  retrieveAll: () => ({
    query: `SELECT 
      id, 
      email, 
      firstname, 
      lastname, 
      "accountType", 
      university, 
      program, 
      "isVerified",
      reputation,
      "yearLevel", 
      avatar,
      created_at
    FROM users`,
  }),

  // UPDATE USER //
  updateEmail: (id: string, email: string) => ({
    query: "UPDATE users SET email = $1 WHERE id = $2",
    values: [email, id],
  }),
  updatePassword: (id: string, password: string) => ({
    query: "UPDATE users SET password = $1 WHERE id = $2",
    values: [password, id],
  }),
  updateFirstname: (id: string, firstname: string) => ({
    query: "UPDATE users SET firstname = $1 WHERE id = $2",
    values: [firstname, id],
  }),
  updateLastname: (id: string, lastname: string) => ({
    query: "UPDATE users SET lastname = $1 WHERE id = $2",
    values: [lastname, id],
  }),
  updateUniversity: (id: string, university: string) => ({
    query: "UPDATE users SET university = $1 WHERE id = $2",
    values: [university, id],
  }),
  updateProgram: (id: string, program: string) => ({
    query: "UPDATE users SET program = $1 WHERE id = $2",
    values: [program, id],
  }),
  updateYearLevel: (id: string, yearLevel: string) => ({
    query: `UPDATE users SET "yearLevel" = $1 WHERE id = $2`,
    values: [yearLevel, id],
  }),
};
export default usersQuery;
