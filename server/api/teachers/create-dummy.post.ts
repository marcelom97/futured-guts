import { getDatabase } from "../../utils/db";

export default defineEventHandler(async (_event) => {
  const db = await getDatabase();

  try {
    // Check if teacher exists
    const existingResult = await db.execute({
      sql: "SELECT * FROM teachers WHERE id = 1",
      args: [],
    });

    if (existingResult.rows.length > 0) {
      return {
        success: true,
        message: "Teacher already exists",
        teacher: existingResult.rows[0],
      };
    }

    // Create dummy teacher
    const result = await db.execute({
      sql: "INSERT INTO teachers (name, email) VALUES (?, ?)",
      args: ["Demo Teacher", "demo@teacher.com"],
    });

    // Get the created teacher
    const newTeacherResult = await db.execute({
      sql: "SELECT * FROM teachers WHERE id = ?",
      args: [Number(result.lastInsertRowid)],
    });

    return {
      success: true,
      message: "Teacher created successfully",
      teacher: newTeacherResult.rows[0],
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to create teacher: ${error}`,
    });
  }
});
