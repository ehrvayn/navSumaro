import { query } from "../../database/Connection.js";
import userQuery from "../../models/userQuery.js";
import bcrypt from "bcrypt";

const RegisterUser = async (userData: any) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    const secureData = { ...userData, password: hashedPassword };

    const { query: sql, values } = userQuery.create(secureData);
    const result = await query(sql, values);

    const { password, ...userWithoutPassword } = result.rows[0];

    const { query: badgeSql, values: badgeValues } =
      userQuery.getVerifiedBadge();
    const badgeResult = await query(badgeSql, badgeValues);
    const verifiedBadgeId = badgeResult.rows[0]?.id;

    if (userData.isVerified && verifiedBadgeId) {
      const { query: assignSql, values: assignValues } = userQuery.assignBadge(
        result.rows[0].id,
        verifiedBadgeId,
      );
      await query(assignSql, assignValues);
    }

    return {
      success: true,
      message: "User registered successfully!",
      data: userWithoutPassword,
    };
  } catch (err: any) {
    console.error(err);
    if (err.code === "23505")
      return { success: false, message: "Email already taken" };
    return { success: false, message: "Registration failed" };
  }
};

export default RegisterUser;
