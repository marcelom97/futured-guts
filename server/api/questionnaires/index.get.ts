import { getDatabase } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { teacher_id } = query;

  const db = await getDatabase();

  try {
    let result;
    if (teacher_id) {
      result = await db.execute({
        sql: "SELECT * FROM questionnaires WHERE teacher_id = ? ORDER BY created_at DESC",
        args: [teacher_id],
      });
    } else {
      result = await db.execute(
        "SELECT * FROM questionnaires ORDER BY created_at DESC"
      );
    }

    return {
      success: true,
      questionnaires: result.rows,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to fetch questionnaires: ${error}`,
    });
  }
});
