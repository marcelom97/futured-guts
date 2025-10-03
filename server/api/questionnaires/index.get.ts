import { getDatabase } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const teacher_id = query.teacher_id as string;

  const db = await getDatabase();

  try {
    let result;
    if (teacher_id) {
      // Get questionnaires with progress information for a specific teacher
      result = await db.execute(
        `
          SELECT 
            q.*,
            COUNT(DISTINCT s.id) as total_students,
            COALESCE(response_data.responses_count, 0) as responses_count,
            response_data.last_response_at
          FROM questionnaires q
          LEFT JOIN students s ON s.teacher_id = q.teacher_id
          LEFT JOIN (
            SELECT 
              qu.questionnaire_id,
              COUNT(DISTINCT r.student_id) as responses_count,
              MAX(r.created_at) as last_response_at
            FROM questions qu
            LEFT JOIN responses r ON r.question_id = qu.id
            GROUP BY qu.questionnaire_id
          ) response_data ON response_data.questionnaire_id = q.id
          WHERE q.teacher_id = ?
          GROUP BY q.id
          ORDER BY q.created_at DESC
        `,
        [teacher_id]
      );
    } else {
      // Get all questionnaires with progress information
      result = await db.execute(
        `
          SELECT 
            q.*,
            COUNT(DISTINCT s.id) as total_students,
            COALESCE(response_data.responses_count, 0) as responses_count,
            response_data.last_response_at
          FROM questionnaires q
          LEFT JOIN students s ON s.teacher_id = q.teacher_id
          LEFT JOIN (
            SELECT 
              qu.questionnaire_id,
              COUNT(DISTINCT r.student_id) as responses_count,
              MAX(r.created_at) as last_response_at
            FROM questions qu
            LEFT JOIN responses r ON r.question_id = qu.id
            GROUP BY qu.questionnaire_id
          ) response_data ON response_data.questionnaire_id = q.id
          GROUP BY q.id
          ORDER BY q.created_at DESC
        `
      );
    }

    return {
      success: true,
      questionnaires: result.rows,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to fetch questionnaires: ${error}`,
    });
  }
});
