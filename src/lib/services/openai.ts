import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIService {
  /**
   * Generate a summary of the provided text using OpenAI
   */
  static async generateSummary(text: string): Promise<string> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY environment variable is not set");
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an expert text summarizer. Create a concise, informative summary of the provided text. 
            The summary should be:
            - Clear and well-structured
            - Capture the main points and key information
            - Be approximately 20-30% of the original text length
            - Written in the same language as the original text
            - Professional and objective in tone`,
          },
          {
            role: "user",
            content: `Please summarize the following text:\n\n${text}`,
          },
        ],
        max_tokens: 500,
        temperature: 0.3, // Lower temperature for more consistent, factual summaries
      });

      const summary = completion.choices[0]?.message?.content;

      if (!summary) {
        throw new Error("Failed to generate summary from OpenAI");
      }

      return summary.trim();
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error(
        `Failed to generate summary: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Generate a summary with specific requirements
   */
  static async generateCustomSummary(
    text: string,
    options: {
      maxLength?: number;
      style?: "formal" | "casual" | "technical";
      language?: string;
    } = {}
  ): Promise<string> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY environment variable is not set");
      }

      const {
        maxLength = 200,
        style = "formal",
        language = "same as original",
      } = options;

      const styleInstructions = {
        formal:
          "Use a formal, professional tone suitable for business or academic contexts.",
        casual: "Use a casual, conversational tone that's easy to understand.",
        technical:
          "Use precise, technical language appropriate for technical documentation.",
      };

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an expert text summarizer. Create a summary that is:
            - Approximately ${maxLength} words or less
            - Written in ${language}
            - ${styleInstructions[style]}
            - Captures the main points and key information
            - Well-structured and easy to read`,
          },
          {
            role: "user",
            content: `Please summarize the following text:\n\n${text}`,
          },
        ],
        max_tokens: Math.min(maxLength * 2, 1000), // Rough estimation
        temperature: 0.3,
      });

      const summary = completion.choices[0]?.message?.content;

      if (!summary) {
        throw new Error("Failed to generate custom summary from OpenAI");
      }

      return summary.trim();
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error(
        `Failed to generate custom summary: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
