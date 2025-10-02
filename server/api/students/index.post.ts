import { getDatabase } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, teacher_id } = body;

  const db = getDatabase();

  try {
    // First, check if a student with this email already exists
    const existingStudent = db
      .prepare("SELECT id FROM students WHERE email = ?")
      .get(email) as { id: number } | undefined;

    if (existingStudent) {
      // Student already exists, return their existing ID
      return {
        success: true,
        student_id: existingStudent.id,
        existing: true,
      };
    }

    // Student doesn't exist, create a new one
    const stmt = db.prepare(
      "INSERT INTO students (name, email, teacher_id) VALUES (?, ?, ?)"
    );
    const result = stmt.run(name, email, teacher_id);

    return {
      success: true,
      student_id: result.lastInsertRowid,
      existing: false,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to create student: ${error}`,
    });
  }
});
