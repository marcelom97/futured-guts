import { getDatabase } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  const db = await getDatabase();

  try {
    // Get questionnaire
    const result = await db.execute({
      sql: "SELECT * FROM questionnaires WHERE id = ?",
      args: [id],
    });

    if (result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Questionnaire not found",
      });
    }

    const questionnaire = result.rows[0];

    // Get questions
    const questionsResult = await db.execute({
      sql: "SELECT * FROM questions WHERE questionnaire_id = ? ORDER BY id",
      args: [id],
    });

    // Parse options and traits for questions
    const parsedQuestions = questionsResult.rows.map((q: any) => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : null,
      trait: q.trait ? JSON.parse(q.trait) : [],
    }));

    // Get trait weights
    const weightsResult = await db.execute({
      sql: "SELECT * FROM trait_weights WHERE questionnaire_id = ?",
      args: [id],
    });

    return {
      success: true,
      questionnaire: {
        ...questionnaire,
        questions: parsedQuestions,
        trait_weights: weightsResult.rows,
      },
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to fetch questionnaire: ${error}`,
    });
  }
});
