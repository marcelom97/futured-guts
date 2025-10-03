import { getDatabase } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { teacher_id, title, description, questions } = body;

  const db = await getDatabase();

  try {
    // Insert questionnaire
    const result = await db.execute({
      sql: "INSERT INTO questionnaires (teacher_id, title, description) VALUES (?, ?, ?)",
      args: [teacher_id, title, description],
    });
    const questionnaireId = Number(result.lastInsertRowid);

    // Insert questions if provided
    if (questions && questions.length > 0) {
      for (const q of questions) {
        await db.execute({
          sql: `INSERT INTO questions 
                (questionnaire_id, question_text, question_type, category, trait, weight, options) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [
            questionnaireId,
            q.question_text,
            q.question_type,
            q.category,
            JSON.stringify(q.trait), // Store trait array as JSON
            q.weight || 1.0,
            q.options ? JSON.stringify(q.options) : null,
          ],
        });
      }
    }

    return {
      success: true,
      questionnaire_id: questionnaireId,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to create questionnaire: ${error}`,
    });
  }
});
