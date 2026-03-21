import { query } from "../../database/Connection.js";
import groupQuery from "../../models/groupQuery.js";

const createGroup = async (groupData: any, currentUser: any) => {
  try {
    const { query: sql, values } = groupQuery.create(groupData, currentUser.id);
    const result = await query(sql, values);
    const group = result.rows[0];

    const { query: memberSql, values: memberValues } = groupQuery.addMember(
      group.id,
      currentUser.id,
      true,
    );
    await query(memberSql, memberValues);

    return {
      success: true,
      message: "Group created successfully!",
      group: result.rows[0],
    };
  } catch (err: any) {
    console.error(err);
    if (err.code === "23505")
      return { success: false, message: "Group name already taken" };
    return { success: false, message: "Creation failed" };
  }
};

export default createGroup;
