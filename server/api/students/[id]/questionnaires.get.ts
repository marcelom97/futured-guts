import { getDatabase } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const studentId = getRouterParam(event, "id");

  const db = await getDatabase();

  try {
    // Get all questionnaires this student has responded to
    const result = await db.execute({
      sql: `
        SELECT DISTINCT
          q.*,
          COUNT(DISTINCT qu.id) as total_questions,
          COUNT(DISTINCT r.id) as answered_questions,
          ROUND((COUNT(DISTINCT r.id) * 100.0) / COUNT(DISTINCT qu.id), 1) as completion_percentage
        FROM questionnaires q
        JOIN questions qu ON q.id = qu.questionnaire_id
        LEFT JOIN responses r ON qu.id = r.question_id AND r.student_id = ?
        WHERE EXISTS (
          SELECT 1 FROM responses r2 
          JOIN questions qu2 ON r2.question_id = qu2.id 
          WHERE qu2.questionnaire_id = q.id AND r2.student_id = ?
        )
        GROUP BY q.id
        ORDER BY q.created_at DESC
      `,
      args: [studentId, studentId],
    });

    return {
      success: true,
      questionnaires: result.rows,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to fetch student questionnaires: ${error}`,
    });
  }
});
