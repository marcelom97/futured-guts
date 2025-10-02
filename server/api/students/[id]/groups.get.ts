import { getDatabase } from "../../../utils/db";

export default defineEventHandler((event) => {
  const studentId = getRouterParam(event, "id");

  const db = getDatabase();

  try {
    // Get all groups this student is a member of
    const groupsStmt = db.prepare(`
      SELECT 
        g.*,
        q.title as questionnaire_title,
        q.description as questionnaire_description,
        COUNT(gm2.student_id) as member_count
      FROM groups g
      JOIN group_members gm ON g.id = gm.group_id
      JOIN questionnaires q ON g.questionnaire_id = q.id
      LEFT JOIN group_members gm2 ON g.id = gm2.group_id
      WHERE gm.student_id = ?
      GROUP BY g.id, q.id
      ORDER BY g.created_at DESC
    `);
    const groups = groupsStmt.all(studentId) as any[];

    // Get detailed members for each group
    const groupsWithMembers = groups.map((group) => {
      const membersStmt = db.prepare(`
        SELECT s.id, s.name, s.email
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
      message: `Failed to fetch student groups: ${error}`,
    });
  }
});