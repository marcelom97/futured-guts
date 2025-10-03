import { getDatabase } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const groupId = getRouterParam(event, "id");
  const body = await readBody(event);
  const { name, student_ids } = body;

  const db = await getDatabase();

  try {
    // Update group name if provided
    if (name) {
      await db.execute({
        sql: "UPDATE groups SET name = ? WHERE id = ?",
        args: [name, groupId],
      });
    }

    // Update members if provided
    if (student_ids) {
      // Use batch for transaction-like behavior
      const statements = [
        {
          sql: "DELETE FROM group_members WHERE group_id = ?",
          args: [groupId],
        },
        ...student_ids.map((studentId: any) => ({
          sql: "INSERT INTO group_members (group_id, student_id) VALUES (?, ?)",
          args: [groupId, studentId],
        })),
      ];

      await db.batch(statements, "write");
    }

    return {
      success: true,
      message: "Group updated successfully",
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to update group: ${error}`,
    });
  }
});
