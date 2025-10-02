import { getDatabase } from "../../utils/db";

export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");

  const db = getDatabase();

  try {
    // Get questionnaire
    const stmt = db.prepare("SELECT * FROM questionnaires WHERE id = ?");
    const questionnaire = stmt.get(id);

    if (!questionnaire) {
      throw createError({
        statusCode: 404,
        message: "Questionnaire not found",
      });
    }

    // Get questions
    const questionsStmt = db.prepare(
      "SELECT * FROM questions WHERE questionnaire_id = ? ORDER BY id"
    );
    const questions = questionsStmt.all(id);

    // Parse options for questions
    const parsedQuestions = questions.map((q: any) => ({
      ...q,
      options: q.options ? JSON.parse(q.options) : null,
    }));

    // Get trait weights
    const weightsStmt = db.prepare(
      "SELECT * FROM trait_weights WHERE questionnaire_id = ?"
    );
    const traitWeights = weightsStmt.all(id);

    return {
      success: true,
      questionnaire: {
        ...questionnaire,
        questions: parsedQuestions,
        trait_weights: traitWeights,
      },
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to fetch questionnaire: ${error}`,
    });
  }
});

