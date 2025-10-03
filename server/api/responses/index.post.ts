import { getDatabase } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { student_id, responses } = body;

  const db = await getDatabase();

  try {
    // Check if student has already responded to this questionnaire
    if (responses && responses.length > 0) {
      const firstQuestionId = responses[0].question_id;

      // Get the questionnaire_id from the first question
      const questionResult = await db.execute({
        sql: "SELECT questionnaire_id FROM questions WHERE id = ?",
        args: [firstQuestionId],
      });

      if (questionResult.rows.length > 0) {
        const question = questionResult.rows[0] as { questionnaire_id: number };

        // Check if student already has responses for this questionnaire
        const existingResult = await db.execute({
          sql: `
            SELECT r.id 
            FROM responses r
            JOIN questions q ON r.question_id = q.id
            WHERE r.student_id = ? AND q.questionnaire_id = ?
            LIMIT 1
          `,
          args: [student_id, question.questionnaire_id],
        });

        if (existingResult.rows.length > 0) {
          throw createError({
            statusCode: 409,
            message: "You have already responded to this questionnaire",
          });
        }
      }
    }

    // Use batch for transaction-like behavior
    await db.batch(
      responses.map((response: any) => ({
        sql: "INSERT INTO responses (student_id, question_id, response_value) VALUES (?, ?, ?)",
        args: [student_id, response.question_id, response.response_value],
      })),
      "write"
    );

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
