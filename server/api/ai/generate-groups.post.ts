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
    const prompt = `You are an expert in educational team formation. Analyze the following student profiles and create ${num_groups} balanced groups.

Grouping Strategy: ${grouping_strategy}
- "balanced": Mix students with different strengths to create well-rounded teams
- "homogeneous": Group students with similar skill levels together
- "diverse": Maximize diversity in each group across all traits

Student Profiles:
${JSON.stringify(studentProfiles, null, 2)}

Create ${num_groups} groups that:
1. Are roughly equal in size
2. ${
      grouping_strategy === "balanced"
        ? "Balance different skill levels and personalities in each group"
        : grouping_strategy === "homogeneous"
        ? "Group students with similar traits and skill levels"
        : "Maximize diversity across all measured traits"
    }
3. Consider the weighted importance of different traits
4. Optimize for effective collaboration

For each group:
- Assign a descriptive name (e.g., "Team Alpha", "The Innovators")
- Include student IDs
- Provide reasoning for the composition

Also provide:
- balance_score: 0-100 score indicating how well-balanced the groups are
- diversity_explanation: Brief explanation of the diversity/balance achieved`;

    const bedrock = createAmazonBedrock({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const { object } = await generateObject({
      model: bedrock("anthropic.claude-3-5-sonnet-20240620-v1:0"),
      schema: GroupingSchema as any,
      prompt,
    });

    // Save groups to database
    const savedGroups = [];
    for (const group of object.groups) {
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

    return {
      success: true,
      groups: savedGroups,
      balance_score: object.balance_score,
      diversity_explanation: object.diversity_explanation,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to generate groups: ${error}`,
    });
  }
});
