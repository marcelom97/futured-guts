import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateObject } from "ai";
import { z } from "zod";

const QuestionSchema = z.object({
  question_text: z.string(),
  question_type: z.enum([
    "scale",
    "multiple_choice",
    "text",
    "yes_no",
    "ranking",
  ]),
  category: z.enum([
    "behavioral",
    "hard_skill",
    "soft_skill",
    "technical",
    "personality",
  ]),
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
- Create questions that assess specific traits from the focus areas
- Use appropriate question types: 'scale' (1-5 rating), 'multiple_choice', 'text' (open-ended), 'yes_no', or 'ranking'
- Categorize appropriately:
  - 'behavioral': personality, work style, preferences
  - 'hard_skill': technical abilities, specific subject knowledge
  - 'soft_skill': communication, teamwork, leadership
  - 'technical': coding, tools, methodologies
  - 'personality': character traits, thinking styles
- For multiple choice questions, provide 4-5 diverse options
- Assign a default weight of 1.0 (teachers can adjust later)
- Set the trait field to the specific trait being assessed (e.g., 'teamwork', 'leadership', 'math')

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
