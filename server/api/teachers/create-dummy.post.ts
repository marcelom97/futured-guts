import { getDatabase } from "../../utils/db";

export default defineEventHandler(async (_event) => {
  const db = getDatabase();

  try {
    // Check if teacher exists
    const existingTeacher = db.prepare('SELECT * FROM teachers WHERE id = 1').get();
    
    if (existingTeacher) {
      return {
        success: true,
        message: 'Teacher already exists',
        teacher: existingTeacher
      };
    }

    // Create dummy teacher
    const stmt = db.prepare(`
      INSERT INTO teachers (name, email) 
      VALUES (?, ?)
    `);
    const result = stmt.run('Demo Teacher', 'demo@teacher.com');

    // Get the created teacher
    const newTeacher = db.prepare('SELECT * FROM teachers WHERE id = ?').get(result.lastInsertRowid);

    return {
      success: true,
      message: 'Teacher created successfully',
      teacher: newTeacher
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to create teacher: ${error}`,
    });
  }
});