import { getDatabase } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { questionnaire_id, trait_weights } = body;

  const db = await getDatabase();

  try {
    // Use batch for transaction-like behavior
    const statements = [
      {
        sql: "DELETE FROM trait_weights WHERE questionnaire_id = ?",
        args: [questionnaire_id],
      },
      ...trait_weights.map((tw: any) => ({
        sql: "INSERT INTO trait_weights (questionnaire_id, trait, weight) VALUES (?, ?, ?)",
        args: [questionnaire_id, tw.trait, tw.weight],
      })),
    ];

    await db.batch(statements, "write");

    return {
      success: true,
      message: "Trait weights updated successfully",
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to update trait weights: ${error}`,
    });
  }
});
