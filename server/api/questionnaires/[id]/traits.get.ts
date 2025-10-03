import { getDatabase } from "../../../utils/db";

interface TraitData {
  trait: string;
  category: string;
  responseCount: number;
  avgScore: number;
  responses: number[];
}

interface TraitAnalytics {
  trait: string;
  category: string;
  responseCount: number;
  avgScore: number;
  distribution: Record<string, number>;
}

export default defineEventHandler(async (event) => {
  const questionnaireId = getRouterParam(event, "id");

  if (!questionnaireId) {
    throw createError({
      statusCode: 400,
      message: "Questionnaire ID is required",
    });
  }

  const db = await getDatabase();

  try {
    // Get all responses for this questionnaire with trait and category information
    const responsesResult = await db.execute(
      `
        SELECT 
          r.response_value,
          q.trait,
          q.category,
          q.question_type
        FROM responses r
        JOIN questions q ON r.question_id = q.id
        WHERE q.questionnaire_id = ?
        ORDER BY q.trait, r.response_value
      `,
      [questionnaireId]
    );

    if (responsesResult.rows.length === 0) {
      return {
        success: true,
        traitsData: [],
      };
    }

    // Group responses by trait
    const traitGroups: Record<string, TraitData> = {};

    for (const row of responsesResult.rows) {
      const response = row as unknown as {
        response_value: string;
        trait: string;
        category: string;
        question_type: string;
      };
      let traits: string[] = [];
      
      // Parse trait field (it might be JSON string or array)
      try {
        traits = response.trait ? JSON.parse(response.trait) : [];
      } catch {
        // If parsing fails, treat as single trait
        traits = response.trait ? [response.trait] : [];
      }

      // Process each trait in the response
      for (const trait of traits) {
        if (!traitGroups[trait]) {
          traitGroups[trait] = {
            trait,
            category: response.category,
            responseCount: 0,
            avgScore: 0,
            responses: [],
          };
        }

        traitGroups[trait].responseCount++;
        
        // Convert response to numeric value for analysis
        let numericValue = 0;
        if (response.question_type === 'scale') {
          numericValue = parseInt(response.response_value) || 0;
        } else if (response.question_type === 'yes_no') {
          numericValue = response.response_value.toLowerCase() === 'yes' ? 1 : 0;
        } else if (response.question_type === 'multiple_choice') {
          // For multiple choice, we'll just count occurrences
          numericValue = 1;
        }
        
        traitGroups[trait].responses.push(numericValue);
      }
    }

    // Calculate analytics for each trait
    const traitsAnalytics: TraitAnalytics[] = Object.values(traitGroups).map((traitData) => {
      const responses = traitData.responses;
      const avgScore = responses.length > 0 
        ? responses.reduce((sum, val) => sum + val, 0) / responses.length 
        : 0;

      // Create distribution of response values
      const distribution: Record<string, number> = {};
      responses.forEach(value => {
        const key = value.toString();
        distribution[key] = (distribution[key] || 0) + 1;
      });

      return {
        trait: traitData.trait,
        category: traitData.category,
        responseCount: traitData.responseCount,
        avgScore: parseFloat(avgScore.toFixed(2)),
        distribution,
      };
    });

    // Sort by category and then by trait name
    traitsAnalytics.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.trait.localeCompare(b.trait);
    });

    return {
      success: true,
      traitsData: traitsAnalytics,
    };
  } catch (error) {
    console.error('Error fetching traits data:', error);
    throw createError({
      statusCode: 500,
      message: `Failed to fetch traits data: ${error}`,
    });
  }
});