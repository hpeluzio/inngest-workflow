import { inngest } from "@/lib/inngest";
import { SummarizeRequestSchema } from "@/lib/schemas";
import { OpenAIService } from "@/lib/services/openai";
import { storeWorkflowResult } from "@/app/api/summarize/status/[eventId]/route";

// Create the Inngest function for text summarization
export const summarizeText = inngest.createFunction(
  { id: "summarize-text" },
  { event: "text/summarize" },
  async ({ event, step }) => {
    // Validate event data with Zod
    const validationResult = SummarizeRequestSchema.safeParse(event.data);

    if (!validationResult.success) {
      throw new Error(
        `Invalid event data: ${validationResult.error.issues
          .map((e) => e.message)
          .join(", ")}`
      );
    }

    const { text, email } = validationResult.data;

    // Step 1: Generate AI summary using OpenAI
    const summary = await step.run("generate-ai-summary", async () => {
      try {
        console.log(
          `Generating AI summary for text of ${text.length} characters`
        );

        // Generate summary using OpenAI
        const aiSummary = await OpenAIService.generateSummary(text);

        console.log(
          `AI summary generated successfully (${aiSummary.length} characters)`
        );
        return aiSummary;
      } catch (error) {
        console.error("Failed to generate AI summary:", error);

        // Fallback to basic summary if OpenAI fails
        return `Summary of your text (${
          text.length
        } characters): ${text.substring(0, 200)}...`;
      }
    });

    // Step 2: Send email notification with the summary
    await step.run("send-notification", async () => {
      try {
        // TODO: Implement actual email sending logic
        // For now, just log the notification
        console.log(`📧 Email notification would be sent to ${email}`);
        console.log(`📄 Summary: ${summary}`);

        return {
          success: true,
          email,
          summaryLength: summary.length,
          sentAt: new Date().toISOString(),
        };
      } catch (error) {
        console.error("Failed to send notification:", error);
        throw new Error(
          `Failed to send notification: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    });

    // Step 3: Store result for polling
    await step.run("store-result", async () => {
      try {
        // Store the result for the polling endpoint
        storeWorkflowResult(event.id || "unknown", {
          status: "completed",
          summary,
        });
        console.log(`📊 Result stored for polling: ${event.id}`);

        return {
          success: true,
          eventId: event.id,
          storedAt: new Date().toISOString(),
        };
      } catch (error) {
        console.error("Failed to store result:", error);
        // Store error result
        storeWorkflowResult(event.id || "unknown", {
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        });
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    });

    return {
      success: true,
      summary,
      email,
      originalTextLength: text.length,
      summaryLength: summary.length,
      processedAt: new Date().toISOString(),
    };
  }
);
