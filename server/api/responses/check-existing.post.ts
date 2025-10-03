import { getDatabase } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, questionnaire_id } = body;

  if (!email || !questionnaire_id) {
    throw createError({
      statusCode: 400,
      message: "Email and questionnaire_id are required",
    });
  }

  const db = await getDatabase();

  try {
    // Check if student exists with this email
    const studentResult = await db.execute({
      sql: "SELECT id FROM students WHERE email = ?",
      args: [email],
    });

    if (studentResult.rows.length === 0) {
      // Student doesn't exist, so they haven't responded
      return {
        hasResponded: false,
      };
    }

    const student = studentResult.rows[0] as any;

    // Check if this student has any responses to questions in this questionnaire
    const existingResult = await db.execute({
      sql: `
        SELECT r.id 
        FROM responses r
        JOIN questions q ON r.question_id = q.id
        WHERE r.student_id = ? AND q.questionnaire_id = ?
        LIMIT 1
      `,
      args: [student.id, questionnaire_id],
    });

    return {
      hasResponded: existingResult.rows.length > 0,
      studentId: student.id,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to check existing responses: ${error}`,
    });
  }
});
