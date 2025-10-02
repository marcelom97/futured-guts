import { getDatabase } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, teacher_id } = body;

  const db = getDatabase();

  try {
    const stmt = db.prepare(
      "INSERT INTO students (name, email, teacher_id) VALUES (?, ?, ?)"
    );
    const result = stmt.run(name, email, teacher_id);

    return {
      success: true,
      student_id: result.lastInsertRowid,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to create student: ${error}`,
    });
  }
});

