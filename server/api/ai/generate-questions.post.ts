import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateObject } from "ai";
import { z } from "zod";

const QuestionSchema = z.object({
  question_text: z.string(),
  question_type: z.enum(["scale", "multiple_choice", "text"]),
  category: z.enum(["behavioral", "hard_skill"]),
  trait: z.string(),
  weight: z.number().default(1.0),
  options: z.array(z.string()).optional(),
});

const QuestionsResponseSchema = z.object({
  questions: z.array(QuestionSchema),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { focus_areas, num_questions = 10 } = body;

  const bedrock = createAmazonBedrock({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  try {
    const prompt = `Generate ${num_questions} questionnaire questions for grouping students into optimal teams.

Focus areas: ${focus_areas.join(", ")}

For each question:
- Create questions that assess specific traits (e.g., teamwork, leadership, communication for behavioral; or specific skills like writing, math, problem-solving for hard_skills)
- Use appropriate question types: 'scale' (1-5 rating), 'multiple_choice', or 'text'
- Categorize as 'behavioral' (personality/work style) or 'hard_skill' (technical ability)
- For multiple choice questions, provide 4-5 diverse options
- Assign a default weight of 1.0 (teachers can adjust later)

Make questions clear, unbiased, and suitable for student team formation in educational settings.`;

    const { object } = await generateObject({
      model: bedrock("anthropic.claude-3-5-sonnet-20240620-v1:0"),
      schema: QuestionsResponseSchema as any,
      prompt,
    });

    return {
      success: true,
      questions: object.questions,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to generate questions: ${error}`,
    });
  }
});

