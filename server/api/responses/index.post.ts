import { getDatabase } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { student_id, responses } = body;

  const db = getDatabase();

  try {
    // Check if student has already responded to this questionnaire
    if (responses && responses.length > 0) {
      const firstQuestionId = responses[0].question_id;

      // Get the questionnaire_id from the first question
      const question = db
        .prepare("SELECT questionnaire_id FROM questions WHERE id = ?")
        .get(firstQuestionId) as { questionnaire_id: number } | undefined;

      if (question) {
        // Check if student already has responses for this questionnaire
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
          .get(student_id, question.questionnaire_id);

        if (existingResponse) {
          throw createError({
            statusCode: 409,
            message: "You have already responded to this questionnaire",
          });
        }
      }
    }

    const stmt = db.prepare(`
      INSERT INTO responses (student_id, question_id, response_value)
      VALUES (?, ?, ?)
    `);

    db.transaction(() => {
      for (const response of responses) {
        stmt.run(student_id, response.question_id, response.response_value);
      }
    })();

    return {
      success: true,
      message: "Responses saved successfully",
    };
  } catch (error: any) {
    // Re-throw if it's already a createError
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: `Failed to save responses: ${error}`,
    });
  }
});
