import { getDatabase } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const groupId = getRouterParam(event, "id");
  const body = await readBody(event);
  const { name, student_ids } = body;

  const db = getDatabase();

  try {
    // Update group name if provided
    if (name) {
      const stmt = db.prepare("UPDATE groups SET name = ? WHERE id = ?");
      stmt.run(name, groupId);
    }

    // Update members if provided
    if (student_ids) {
      db.transaction(() => {
        // Remove existing members
        const deleteStmt = db.prepare("DELETE FROM group_members WHERE group_id = ?");
        deleteStmt.run(groupId);

        // Add new members
        const insertStmt = db.prepare(
          "INSERT INTO group_members (group_id, student_id) VALUES (?, ?)"
        );
        for (const studentId of student_ids) {
          insertStmt.run(groupId, studentId);
        }
      })();
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

