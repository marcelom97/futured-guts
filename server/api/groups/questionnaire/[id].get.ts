import { getDatabase } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const questionnaireId = getRouterParam(event, "id");

  const db = await getDatabase();

  try {
    // Get all groups for this questionnaire
    const groupsResult = await db.execute({
      sql: "SELECT * FROM groups WHERE questionnaire_id = ? ORDER BY created_at DESC",
      args: [questionnaireId],
    });

    // Get members for each group
    const groupsWithMembers = await Promise.all(
      groupsResult.rows.map(async (group: any) => {
        const membersResult = await db.execute({
          sql: `
            SELECT s.* 
            FROM group_members gm
            JOIN students s ON gm.student_id = s.id
            WHERE gm.group_id = ?
            ORDER BY s.name
          `,
          args: [group.id],
        });

        return {
          ...group,
          members: membersResult.rows,
        };
      })
    );

    // Get grouping metadata (balance score and diversity explanation)
    const metadataResult = await db.execute({
      sql: "SELECT balance_score, diversity_explanation FROM grouping_metadata WHERE questionnaire_id = ?",
      args: [questionnaireId],
    });
    const metadata = metadataResult.rows[0] as any;

    return {
      success: true,
      groups: groupsWithMembers,
      balance_score: metadata?.balance_score || null,
      diversity_explanation: metadata?.diversity_explanation || null,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to fetch groups: ${error}`,
    });
  }
});
