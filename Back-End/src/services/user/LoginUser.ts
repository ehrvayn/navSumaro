import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userQuery from "../../models/userQuery.js";
import { query } from "../../database/Connection.js";

const LoginUser = async (email: string, password: string) => {
  try {
    const { query: sql, values } = userQuery.login(email);
    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return { success: false, message: "Invalid credentials" };
    }

    const user = result.rows[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return { success: false, message: "Invalid credentials" };
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
        isVerified: user.isVerified
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    return { success: true, message: "Login Successful!", token };
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Something went wrong" };
  }
};

export default LoginUser;
