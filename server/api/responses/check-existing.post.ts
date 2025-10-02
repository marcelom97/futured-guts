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

  const db = getDatabase();

  try {
    // Check if student exists with this email
    const student = db
      .prepare("SELECT id FROM students WHERE email = ?")
      .get(email) as { id: number } | undefined;

    if (!student) {
      // Student doesn't exist, so they haven't responded
      return {
        hasResponded: false,
      };
    }

    // Check if this student has any responses to questions in this questionnaire
    const existingResponse = db
      .prepare(
        `
      SELECT r.id 
      FROM responses r
      JOIN questions q ON r.question_id = q.id
      WHERE r.student_id = ? AND q.questionnaire_id = ?
      LIMIT 1
    `
      )
      .get(student.id, questionnaire_id);

    return {
      hasResponded: !!existingResponse,
      studentId: student.id,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to check existing responses: ${error}`,
    });
  }
});
