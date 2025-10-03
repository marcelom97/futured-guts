import { getDatabase } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { teacher_id } = query;

  const db = await getDatabase();

  try {
    let result;
    if (teacher_id) {
      // Get students with group count and questionnaire count
      result = await db.execute({
        sql: `
        SELECT 
          s.*,
          COALESCE(gm_count.group_count, 0) as group_count,
          COALESCE(q_count.questionnaire_count, 0) as questionnaire_count
        FROM students s
        LEFT JOIN (
          SELECT 
            s.id as student_id,
            COUNT(DISTINCT gm.group_id) as group_count
          FROM students s
          LEFT JOIN group_members gm ON s.id = gm.student_id
          WHERE s.teacher_id = ?
          GROUP BY s.id
        ) gm_count ON s.id = gm_count.student_id
        LEFT JOIN (
          SELECT 
            s.id as student_id,
            COUNT(DISTINCT q.id) as questionnaire_count
          FROM students s
          LEFT JOIN responses r ON s.id = r.student_id
          LEFT JOIN questions qu ON r.question_id = qu.id
          LEFT JOIN questionnaires q ON qu.questionnaire_id = q.id
          WHERE s.teacher_id = ?
          GROUP BY s.id
        ) q_count ON s.id = q_count.student_id
        WHERE s.teacher_id = ?
        ORDER BY s.name
      `,
        args: [teacher_id, teacher_id, teacher_id],
      });
    } else {
      // Get all students with group count and questionnaire count
      result = await db.execute(`
        SELECT 
          s.*,
          COALESCE(gm_count.group_count, 0) as group_count,
          COALESCE(q_count.questionnaire_count, 0) as questionnaire_count
        FROM students s
        LEFT JOIN (
          SELECT 
            s.id as student_id,
            COUNT(DISTINCT gm.group_id) as group_count
          FROM students s
          LEFT JOIN group_members gm ON s.id = gm.student_id
          GROUP BY s.id
        ) gm_count ON s.id = gm_count.student_id
        LEFT JOIN (
          SELECT 
            s.id as student_id,
            COUNT(DISTINCT q.id) as questionnaire_count
          FROM students s
          LEFT JOIN responses r ON s.id = r.student_id
          LEFT JOIN questions qu ON r.question_id = qu.id
          LEFT JOIN questionnaires q ON qu.questionnaire_id = q.id
          GROUP BY s.id
        ) q_count ON s.id = q_count.student_id
        ORDER BY s.name
      `);
    }

    return {
      success: true,
      students: result.rows,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to fetch students: ${error}`,
    });
  }
});
