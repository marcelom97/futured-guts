import { getDatabase } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { student_id, responses } = body;

  const db = getDatabase();

  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO responses (student_id, question_id, response_value)
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
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to save responses: ${error}`,
    });
  }
});

