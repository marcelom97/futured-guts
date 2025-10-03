import { getDatabase } from "../../utils/db";

export default defineEventHandler(async (_event) => {
  const db = await getDatabase();

  try {
    const result = await db.execute("SELECT * FROM teachers");

    return {
      success: true,
      teachers: result.rows,
      count: result.rows.length,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to fetch teachers: ${error}`,
    });
  }
});
