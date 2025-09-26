import { inngest } from "@/lib/inngest";
import { InngestEventDataSchema } from "@/lib/schemas/external-api";

// Inngest function to process external data
export const processExternalData = inngest.createFunction(
  { id: "process-external-data" },
  { event: "external-data/process" },
  async ({ event, step }) => {
    // 🔍 VALIDATION POINT: Validate incoming event data
    const validationResult = InngestEventDataSchema.safeParse(event.data);

    if (!validationResult.success) {
      throw new Error(
        `Invalid event data: ${validationResult.error.issues
          .map((e) => e.message)
          .join(", ")}`
      );
    }

    const data = validationResult.data;

    // Step 1: Generate summary if requested
    const summary = await step.run("generate-summary", async () => {
      if (!data.processingOptions.generateSummary) {
        return null;
      }

      // TODO: Implement actual AI summarization
      return `Summary of "${data.title}" by ${data.author} (${data.wordCount} words)`;
    });

    // Step 2: Process tags and metadata
    const processedTags = await step.run("process-tags", async () => {
      return data.tags.map((tag) => tag.toLowerCase().trim()).filter(Boolean);
    });

    // Step 3: Send notification if requested
    await step.run("send-notification", async () => {
      if (!data.processingOptions.sendNotification) {
        return { sent: false };
      }

      // TODO: Implement actual notification logic
      console.log(`Notification sent for: ${data.title}`);
      return { sent: true, title: data.title };
    });

    // Step 4: Store processed data
    const storedData = await step.run("store-data", async () => {
      // TODO: Implement actual storage logic
      return {
        id: data.sourceId,
        title: data.title,
        summary,
        tags: processedTags,
        processedAt: new Date().toISOString(),
      };
    });

    return {
      success: true,
      data: storedData,
      processingOptions: data.processingOptions,
    };
  }
);
