import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userQuery from "../models/userQuery.js";
import orgQuery from "../models/orgQuery.js";
import { query } from "../database/Connection.js";

const Login = async (email: string, password: string) => {
  try {
    const { query: userSql, values: userValues } = userQuery.login(email);
    const userResult = await query(userSql, userValues);

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return { success: false, message: "Wrong password!" };
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          accountType: user.accountType,
          firstname: user.firstname,
          lastname: user.lastname,
          program: user.program,
          avatar: user.avatar,
          isVerified: user.isVerified,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" },
      );

      return { success: true, message: "Login Successful!", token };
    } 

    const { query: orgSql, values: orgValues } = orgQuery.login(email);
    const orgResult = await query(orgSql, orgValues);

    if (orgResult.rows.length > 0) {
      const org = orgResult.rows[0];
      const isPasswordCorrect = await bcrypt.compare(password, org.password);

      if (!isPasswordCorrect) {
        return { success: false, message: "Wrong password!" };
      }

      const token = jwt.sign(
        {
          id: org.id,
          email: org.email,
          accountType: org.accountType,
          name: org.name,
          organizationType: org.organizationType,
          avatar: org.avatar,
          isVerified: org.isVerified,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" },
      );

      return { success: true, message: "Login Successful!", token };
    }

    return { success: false, message: "Email doesn't Exist!" };
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Something went wrong" };
  }
};

export default Login;
