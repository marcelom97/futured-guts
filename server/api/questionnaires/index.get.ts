import { getDatabase } from "../../utils/db";

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const { teacher_id } = query;

  const db = getDatabase();

  try {
    let questionnaires;
    if (teacher_id) {
      const stmt = db.prepare(
        "SELECT * FROM questionnaires WHERE teacher_id = ? ORDER BY created_at DESC"
      );
      questionnaires = stmt.all(teacher_id);
    } else {
      const stmt = db.prepare(
        "SELECT * FROM questionnaires ORDER BY created_at DESC"
      );
      questionnaires = stmt.all();
    }

    return {
      success: true,
      questionnaires,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to fetch questionnaires: ${error}`,
    });
  }
});

