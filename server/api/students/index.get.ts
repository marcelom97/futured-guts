import { getDatabase } from "../../utils/db";

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const { teacher_id } = query;

  const db = getDatabase();

  try {
    let students;
    if (teacher_id) {
      const stmt = db.prepare(
        "SELECT * FROM students WHERE teacher_id = ? ORDER BY name"
      );
      students = stmt.all(teacher_id);
    } else {
      const stmt = db.prepare("SELECT * FROM students ORDER BY name");
      students = stmt.all();
    }

    return {
      success: true,
      students,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to fetch students: ${error}`,
    });
  }
});

