import { getDatabase } from "../../../utils/db";

interface StudentTraitData {
  trait: string;
  category: string;
  avgScore: number;
  responseCount: number;
  questionnaires: string[];
}

export default defineEventHandler(async (event) => {
  const studentId = getRouterParam(event, "id");

  if (!studentId) {
    throw createError({
      statusCode: 400,
      message: "Student ID is required",
    });
  }

  const db = await getDatabase();

  try {
    // Get all responses for this student with trait and category information
    const responsesResult = await db.execute({
      sql: `
        SELECT 
          r.response_value,
          q.trait,
          q.category,
          q.question_type,
          quest.title as questionnaire_title
        FROM responses r
        JOIN questions q ON r.question_id = q.id
        JOIN questionnaires quest ON q.questionnaire_id = quest.id
        WHERE r.student_id = ?
        ORDER BY q.trait, r.response_value
      `,
      args: [studentId],
    });

    if (responsesResult.rows.length === 0) {
      return {
        success: true,
        traitsData: [],
      };
    }

    // Group responses by trait
    const traitGroups: Record<string, StudentTraitData> = {};

    for (const row of responsesResult.rows) {
      const response = row as unknown as {
        response_value: string;
        trait: string;
        category: string;
        question_type: string;
        questionnaire_title: string;
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
            avgScore: 0,
            responseCount: 0,
            questionnaires: [],
          };
        }

        traitGroups[trait].responseCount++;
        
        // Add questionnaire to the list if not already present
        if (!traitGroups[trait].questionnaires.includes(response.questionnaire_title)) {
          traitGroups[trait].questionnaires.push(response.questionnaire_title);
        }

        // Convert response to numeric value for analysis
        let numericValue = 0;
        if (response.question_type === 'scale') {
          numericValue = parseInt(response.response_value) || 0;
        } else if (response.question_type === 'yes_no') {
          numericValue = response.response_value.toLowerCase() === 'yes' ? 5 : 1;
        } else if (response.question_type === 'multiple_choice') {
          // For multiple choice, assign a moderate score
          numericValue = 3;
        }
        
        // Calculate running average
        const currentTotal = traitGroups[trait].avgScore * (traitGroups[trait].responseCount - 1);
        traitGroups[trait].avgScore = (currentTotal + numericValue) / traitGroups[trait].responseCount;
      }
    }

    // Convert to array and sort by category and trait name
    const traitsData = Object.values(traitGroups)
      .map((traitData) => ({
        ...traitData,
        avgScore: parseFloat(traitData.avgScore.toFixed(2)),
      }))
      .sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.trait.localeCompare(b.trait);
      });

    return {
      success: true,
      traitsData,
    };
  } catch (error) {
    console.error('Error fetching student traits data:', error);
    throw createError({
      statusCode: 500,
      message: `Failed to fetch student traits data: ${error}`,
    });
  }
});