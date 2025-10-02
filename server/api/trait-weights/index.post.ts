import { getDatabase } from "../../utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { questionnaire_id, trait_weights } = body;

  const db = getDatabase();

  try {
    db.transaction(() => {
      // Remove existing weights
      const deleteStmt = db.prepare(
        "DELETE FROM trait_weights WHERE questionnaire_id = ?"
      );
      deleteStmt.run(questionnaire_id);

      // Insert new weights
      const insertStmt = db.prepare(
        "INSERT INTO trait_weights (questionnaire_id, trait, weight) VALUES (?, ?, ?)"
      );
      for (const tw of trait_weights) {
        insertStmt.run(questionnaire_id, tw.trait, tw.weight);
      }
    })();

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

