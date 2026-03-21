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
};
export default orgQuery;
