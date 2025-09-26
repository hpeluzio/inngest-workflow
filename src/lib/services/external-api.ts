import {
  ExternalApiResponseSchema,
  ProcessedDataSchema,
  InngestEventDataSchema,
  ExternalApiResponse,
} from "@/lib/schemas/external-api";
import { inngest } from "@/lib/inngest";

// Service for fetching data from external APIs
export class ExternalApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  // 1. VALIDATION POINT: Raw API response validation
  async fetchData(id: string) {
    try {
      const response = await fetch(`${this.baseUrl}/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const rawData = await response.json();

      // 🔍 FIRST VALIDATION: Validate external API response
      const validationResult = ExternalApiResponseSchema.safeParse(rawData);

      if (!validationResult.success) {
        console.error("Invalid API response:", validationResult.error.issues);
        throw new Error(
          `Invalid API response: ${validationResult.error.issues
            .map((i) => i.message)
            .join(", ")}`
        );
      }

      return validationResult.data;
    } catch (error) {
      console.error("Failed to fetch data from external API:", error);
      throw error;
    }
  }

  // 2. TRANSFORMATION & VALIDATION: Process data for internal use
  private transformData(apiData: ExternalApiResponse) {
    // Transform external API data to our internal format
    const processedData = {
      sourceId: apiData.id,
      title: apiData.title,
      content: apiData.content,
      author: apiData.author,
      publishedAt: new Date(apiData.publishedAt),
      tags: apiData.tags || [],
      wordCount: apiData.content.split(" ").length,
    };

    // 🔍 SECOND VALIDATION: Validate processed data
    const validationResult = ProcessedDataSchema.safeParse(processedData);

    if (!validationResult.success) {
      throw new Error(
        `Data transformation failed: ${validationResult.error.issues
          .map((i) => i.message)
          .join(", ")}`
      );
    }

    return validationResult.data;
  }

  // 3. INNGEST INTEGRATION: Send validated data to workflows
  async processAndIngest(
    id: string,
    options: {
      generateSummary?: boolean;
      sendNotification?: boolean;
      priority?: "low" | "medium" | "high";
    } = {}
  ) {
    try {
      // Step 1: Fetch and validate external data
      const apiData = await this.fetchData(id);

      // Step 2: Transform and validate processed data
      const processedData = this.transformData(apiData);

      // Step 3: Prepare Inngest event data
      const eventData = {
        sourceId: processedData.sourceId,
        title: processedData.title,
        content: processedData.content,
        author: processedData.author,
        publishedAt: processedData.publishedAt.toISOString(),
        tags: processedData.tags,
        wordCount: processedData.wordCount,
        processingOptions: {
          generateSummary: options.generateSummary ?? true,
          sendNotification: options.sendNotification ?? true,
          priority: options.priority ?? "medium",
        },
      };

      // 🔍 THIRD VALIDATION: Validate Inngest event data
      const eventValidation = InngestEventDataSchema.safeParse(eventData);

      if (!eventValidation.success) {
        throw new Error(
          `Inngest event validation failed: ${eventValidation.error.issues
            .map((i) => i.message)
            .join(", ")}`
        );
      }

      // Step 4: Send to Inngest
      const result = await inngest.send({
        name: "external-data/process",
        data: eventValidation.data,
      });

      return {
        success: true,
        eventId: result.ids[0],
        processedData,
      };
    } catch (error) {
      console.error("Failed to process and ingest data:", error);
      throw error;
    }
  }
}
