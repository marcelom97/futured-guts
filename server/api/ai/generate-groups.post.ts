import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateObject } from "ai";
import { z } from "zod";
import { getDatabase } from "../../utils/db";

const GroupingSchema = z.object({
  groups: z.array(
    z.object({
      name: z.string(),
      student_ids: z.array(z.number()),
      reasoning: z.string(),
    })
  ),
  balance_score: z.number().min(0).max(100),
  diversity_explanation: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { questionnaire_id, num_groups, grouping_strategy = "balanced" } = body;

  const db = getDatabase();

  try {
    // Get questionnaire details
    const questionnaireStmt = db.prepare(
      "SELECT * FROM questionnaires WHERE id = ?"
    );
    const questionnaire = questionnaireStmt.get(questionnaire_id) as any;

    if (!questionnaire) {
      throw createError({
        statusCode: 404,
        message: "Questionnaire not found",
      });
    }

    // Get all questions
    const questionsStmt = db.prepare(
      "SELECT * FROM questions WHERE questionnaire_id = ?"
    );
    const questions = questionsStmt.all(questionnaire_id) as any[];

    // Get trait weights
    const weightsStmt = db.prepare(
      "SELECT * FROM trait_weights WHERE questionnaire_id = ?"
    );
    const traitWeights = weightsStmt.all(questionnaire_id) as any[];
    const weightMap = Object.fromEntries(
      traitWeights.map((tw) => [tw.trait, tw.weight])
    );

    // Get all responses for this questionnaire
    const questionIds = questions.map((q) => q.id);
    if (questionIds.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No questions found for this questionnaire",
      });
    }

    const placeholders = questionIds.map(() => "?").join(",");
    const responsesStmt = db.prepare(`
      SELECT r.*, s.name as student_name, s.id as student_id, 
             q.trait, q.category, q.weight, q.question_type
      FROM responses r
      JOIN students s ON r.student_id = s.id
      JOIN questions q ON r.question_id = q.id
      WHERE r.question_id IN (${placeholders})
    `);
    const responses = responsesStmt.all(...questionIds) as any[];

    // Get unique students who completed the questionnaire
    const studentIds = [...new Set(responses.map((r) => r.student_id))];
    const studentsStmt = db.prepare(`
      SELECT * FROM students WHERE id IN (${studentIds
        .map(() => "?")
        .join(",")})
    `);
    const students = studentsStmt.all(...studentIds) as any[];

    // Validate we have enough students
    if (students.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No students have completed this questionnaire yet.",
      });
    }

    // Adjust num_groups if we don't have enough students
    // Each group should have at least 2 students
    const maxGroups = Math.floor(students.length / 2);
    const adjustedNumGroups = Math.min(num_groups, maxGroups);

    if (adjustedNumGroups < 1) {
      throw createError({
        statusCode: 400,
        message: `Not enough students to form groups. Need at least 2 students, but only ${students.length} have completed the questionnaire.`,
      });
    }

    // Build student profiles
    const studentProfiles = students.map((student) => {
      const studentResponses = responses.filter(
        (r) => r.student_id === student.id
      );
      const traits: Record<string, any> = {};

      studentResponses.forEach((r) => {
        const weight = weightMap[r.trait] || r.weight || 1.0;
        if (!traits[r.trait]) {
          traits[r.trait] = {
            category: r.category,
            responses: [],
            weight,
          };
        }
        traits[r.trait].responses.push({
          value: r.response_value,
          type: r.question_type,
        });
      });

      return {
        id: student.id,
        name: student.name,
        traits,
      };
    });

    // Create prompt for AI grouping
    const prompt = `You are an expert in educational team formation. Analyze the following student profiles and create EXACTLY ${adjustedNumGroups} balanced groups.

IMPORTANT: You have ${
      students.length
    } students total. You MUST create exactly ${adjustedNumGroups} groups, and ALL students must be assigned to a group.

Grouping Strategy: ${grouping_strategy}
- "balanced": Mix students with different strengths to create well-rounded teams
- "homogeneous": Group students with similar skill levels together
- "diverse": Maximize diversity in each group across all traits

Student Profiles (${students.length} students total):
${JSON.stringify(studentProfiles, null, 2)}

Create EXACTLY ${adjustedNumGroups} groups that:
1. Are roughly equal in size (distribute all ${
      students.length
    } students across ${adjustedNumGroups} groups)
2. ${
      grouping_strategy === "balanced"
        ? "Balance different skill levels and personalities in each group"
        : grouping_strategy === "homogeneous"
        ? "Group students with similar traits and skill levels"
        : "Maximize diversity across all measured traits"
    }
3. Consider the weighted importance of different traits
4. Optimize for effective collaboration
5. EVERY student must be assigned to exactly ONE group - no student should be left unassigned

For each group:
- Assign a descriptive name (e.g., "Team Alpha", "The Innovators")
- Include student IDs (use ONLY the IDs from the student profiles provided)
- Provide reasoning for the composition

CRITICAL RULES:
- Create EXACTLY ${adjustedNumGroups} groups, no more, no less
- Use ONLY valid student IDs from the profiles provided above
- NEVER use placeholder IDs like [<UNKNOWN>] or empty arrays
- If you cannot form a group properly, do not include it in the response

Also provide:
- balance_score: 0-100 score indicating how well-balanced the groups are
- diversity_explanation: Brief explanation of the diversity/balance achieved`;

    console.log(prompt);

    console.log(
      `Creating ${adjustedNumGroups} groups from ${students.length} students`
    );
    if (adjustedNumGroups < num_groups) {
      console.log(
        `Adjusted group count from ${num_groups} to ${adjustedNumGroups} based on available students`
      );
    }

    const bedrock = createAmazonBedrock({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    let aiResponse;
    try {
      const result = await generateObject({
        model: bedrock("anthropic.claude-3-5-sonnet-20240620-v1:0"),
        schema: GroupingSchema,
        mode: "json",
        prompt,
      });
      aiResponse = result.object;
    } catch (aiError: any) {
      console.error("AI Generation Error:", aiError);
      console.error("AI Error Details:", aiError.cause);
      throw createError({
        statusCode: 500,
        message: `AI failed to generate valid groups: ${aiError.message}. Please try again.`,
      });
    }

    // Delete old groups and members in a transaction
    const deleteOldGroups = db.transaction(() => {
      // First, get all group IDs for this questionnaire
      const getGroupsStmt = db.prepare(
        "SELECT id FROM groups WHERE questionnaire_id = ?"
      );
      const existingGroups = getGroupsStmt.all(questionnaire_id) as any[];

      if (existingGroups.length > 0) {
        const groupIds = existingGroups.map((g) => g.id);
        const placeholders = groupIds.map(() => "?").join(",");

        // Delete group members first (foreign key constraint)
        const deleteMembersStmt = db.prepare(
          `DELETE FROM group_members WHERE group_id IN (${placeholders})`
        );
        deleteMembersStmt.run(...groupIds);

        // Then delete the groups
        const deleteGroupsStmt = db.prepare(
          `DELETE FROM groups WHERE questionnaire_id = ?`
        );
        deleteGroupsStmt.run(questionnaire_id);
      }
    });

    deleteOldGroups();

    // Save new groups to database
    const savedGroups = [];
    for (const group of aiResponse.groups) {
      const groupStmt = db.prepare(
        "INSERT INTO groups (questionnaire_id, name) VALUES (?, ?)"
      );
      const groupResult = groupStmt.run(questionnaire_id, group.name);
      const groupId = groupResult.lastInsertRowid;

      const memberStmt = db.prepare(
        "INSERT INTO group_members (group_id, student_id) VALUES (?, ?)"
      );
      for (const studentId of group.student_ids) {
        memberStmt.run(groupId, studentId);
      }

      savedGroups.push({
        id: groupId,
        name: group.name,
        student_ids: group.student_ids,
        reasoning: group.reasoning,
      });
    }

    // Save or update grouping metadata
    const metadataStmt = db.prepare(`
      INSERT INTO grouping_metadata (questionnaire_id, balance_score, diversity_explanation, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(questionnaire_id) 
      DO UPDATE SET 
        balance_score = excluded.balance_score,
        diversity_explanation = excluded.diversity_explanation,
        updated_at = CURRENT_TIMESTAMP
    `);
    metadataStmt.run(
      questionnaire_id,
      aiResponse.balance_score,
      aiResponse.diversity_explanation
    );

    return {
      success: true,
      groups: savedGroups,
      balance_score: aiResponse.balance_score,
      diversity_explanation: aiResponse.diversity_explanation,
      adjusted_groups: adjustedNumGroups !== num_groups,
      requested_groups: num_groups,
      created_groups: adjustedNumGroups,
      total_students: students.length,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to generate groups: ${error}`,
    });
  }
});
