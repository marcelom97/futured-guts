import { getDatabase } from "../../../utils/db";

export default defineEventHandler((event) => {
  const questionnaireId = getRouterParam(event, "id");

  const db = getDatabase();

  try {
    // Get all questions for this questionnaire
    const questionsStmt = db.prepare(
      "SELECT id FROM questions WHERE questionnaire_id = ?"
    );
    const questions = questionsStmt.all(questionnaireId) as Array<{
      id: number;
    }>;
    const questionIds = questions.map((q) => q.id);

    if (questionIds.length === 0) {
      return {
        success: true,
        responses: [],
      };
    }

    // Get all responses for these questions
    const placeholders = questionIds.map(() => "?").join(",");
    const responsesStmt = db.prepare(`
      SELECT r.*, s.name as student_name, q.question_text, q.trait, q.category
      FROM responses r
      JOIN students s ON r.student_id = s.id
      JOIN questions q ON r.question_id = q.id
      WHERE r.question_id IN (${placeholders})
      ORDER BY r.student_id, r.question_id
    `);
    const responses = responsesStmt.all(...questionIds);

    // Parse trait field for each response
    const parsedResponses = responses.map((r: any) => ({
      ...r,
      trait: r.trait ? JSON.parse(r.trait) : [],
    }));

    return {
      success: true,
      responses: parsedResponses,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to fetch responses: ${error}`,
    });
  }
});
