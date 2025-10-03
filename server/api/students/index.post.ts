import { getDatabase } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, teacher_id } = body;

  const db = await getDatabase();

  try {
    // First, check if a student with this email already exists
    const existingResult = await db.execute({
      sql: "SELECT id FROM students WHERE email = ?",
      args: [email],
    });

    if (existingResult.rows.length > 0) {
      // Student already exists, return their existing ID
      const existingStudent = existingResult.rows[0] as { id: number };
      return {
        success: true,
        student_id: existingStudent.id,
        existing: true,
      };
    }

    // Student doesn't exist, create a new one
    const result = await db.execute({
      sql: "INSERT INTO students (name, email, teacher_id) VALUES (?, ?, ?)",
      args: [name, email, teacher_id],
    });

    return {
      success: true,
      student_id: Number(result.lastInsertRowid),
      existing: false,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to create student: ${error}`,
    });
  }
});
