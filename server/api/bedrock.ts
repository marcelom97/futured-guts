import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateText } from "ai";

export default defineEventHandler(async (event) => {
  const bedrock = createAmazonBedrock({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const { text } = await generateText({
    model: bedrock("anthropic.claude-3-5-sonnet-20240620-v1:0"),
    prompt: "Write a haiku about coding",
  });

  return {
    response: text,
  };
});
