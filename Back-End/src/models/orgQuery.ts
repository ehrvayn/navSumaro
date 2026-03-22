const orgQuery = {
  login: (email: string) => ({
    query: `SELECT * FROM organizations WHERE email = $1`,
    values: [email],
  }),
  register: (orgData: any) => ({
    query: `
      INSERT INTO organizations ("accountType", name, email, password, university, "organizationType", description) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING id, name, email, university, "organizationType", description, "isVerified", "verificationStatus", created_at
    `,
    values: [
      orgData.accountType,
      orgData.name,
      orgData.email,
      orgData.password,
      orgData.university,
      orgData.organizationType,
      orgData.description,
    ],
  }),
  retrieveById: (id: string) => ({
    query: `
    SELECT id, name, email, avatar, "coverPhoto", university, "organizationType", 
           description, "isVerified", "verificationStatus", created_at, "accountType"
    FROM organizations WHERE id = $1
  `,
    values: [id],
  }),
  createEvent: (eventData: any, orgId: any) => ({
    query: `INSERT INTO events ("organizerId", title, month, day, color, description, location, "startTime", "endTime")
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id, "organizerId", title, month, day, color, description, location, "startTime", "endTime", "createdAt"`,
    values: [
      orgId,
      eventData.title,
      eventData.month,
      eventData.day,
      eventData.color,
      eventData.description || null,
      eventData.location || null,
      eventData.startTime,
      eventData.endTime || null,
    ],
  }),
  retrieveAllEvents: () => ({
    query: `
    SELECT 
      e.*,
      json_build_object(
        'id', o.id,
        'name', o.name,
        'avatar', o.avatar,
        'organizationType', o."organizationType",
        'isVerified', o."isVerified"
      ) as organizer
    FROM events e
    LEFT JOIN organizations o ON e."organizerId" = o.id
    ORDER BY e."createdAt" DESC
  `,
    values: [],
  }),

  // update //

  updateEmail: (id: string, email: string) => ({
    query: "UPDATE organizations SET email = $1 WHERE id = $2",
    values: [email, id],
  }),
  updatePassword: (id: string, password: string) => ({
    query: "UPDATE organizations SET password = $1 WHERE id = $2",
    values: [password, id],
  }),
  updateName: (id: string, name: string) => ({
    query: "UPDATE organizations SET name = $1 WHERE id = $2",
    values: [name, id],
  }),
  updateDescription: (id: string, description: string) => ({
    query: "UPDATE organizations SET description = $1 WHERE id = $2",
    values: [description, id],
  }),
  updateUniversity: (id: string, university: string) => ({
    query: "UPDATE organizations SET university = $1 WHERE id = $2",
    values: [university, id],
  }),
  updateOrgType: (id: string, orgType: string) => ({
    query: `UPDATE organizations SET "organizationType" = $1 WHERE id = $2`,
    values: [orgType, id],
  }),
};

export default orgQuery;
