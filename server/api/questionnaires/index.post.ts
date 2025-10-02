import { getDatabase } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { teacher_id, title, description, questions } = body;

  const db = getDatabase();

  try {
    // Insert questionnaire
    const stmt = db.prepare(
      "INSERT INTO questionnaires (teacher_id, title, description) VALUES (?, ?, ?)"
    );
    const result = stmt.run(teacher_id, title, description);
    const questionnaireId = result.lastInsertRowid;

    // Insert questions if provided
    if (questions && questions.length > 0) {
      const questionStmt = db.prepare(`
        INSERT INTO questions 
        (questionnaire_id, question_text, question_type, category, trait, weight, options) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (const q of questions) {
        questionStmt.run(
          questionnaireId,
          q.question_text,
          q.question_type,
          q.category,
          q.trait,
          q.weight || 1.0,
          q.options ? JSON.stringify(q.options) : null
        );
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

