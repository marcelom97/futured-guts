import { getDatabase } from "../../utils/db";

export default defineEventHandler(async (_event) => {
  const db = getDatabase();

  try {
    const teachers = db.prepare('SELECT * FROM teachers').all();
    
    return {
      success: true,
      teachers,
      count: teachers.length
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to fetch teachers: ${error}`,
    });
  }
});