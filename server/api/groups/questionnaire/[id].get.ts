import { getDatabase } from "../../../utils/db";

export default defineEventHandler((event) => {
  const questionnaireId = getRouterParam(event, "id");

  const db = getDatabase();

  try {
    // Get all groups for this questionnaire
    const groupsStmt = db.prepare(
      "SELECT * FROM groups WHERE questionnaire_id = ? ORDER BY created_at DESC"
    );
    const groups = groupsStmt.all(questionnaireId) as any[];

    // Get members for each group
    const groupsWithMembers = groups.map((group) => {
      const membersStmt = db.prepare(`
        SELECT s.* 
        FROM group_members gm
        JOIN students s ON gm.student_id = s.id
        WHERE gm.group_id = ?
        ORDER BY s.name
      `);
      const members = membersStmt.all(group.id);

      return {
        ...group,
        members,
      };
    });

    return {
      success: true,
      groups: groupsWithMembers,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to fetch groups: ${error}`,
    });
  }
});

