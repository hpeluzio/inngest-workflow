import { NextRequest, NextResponse } from "next/server";
import { MockApiService } from "@/lib/services/mock-service";
import { z } from "zod";
import { inngest } from "@/lib/inngest";

// Schema for processing request
const ProcessArticleRequestSchema = z.object({
  articleId: z.string().min(1, "Article ID is required"),
  options: z
    .object({
      generateSummary: z.boolean().optional(),
      sendNotification: z.boolean().optional(),
      priority: z.enum(["low", "medium", "high"]).optional(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validationResult = ProcessArticleRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { articleId, options } = validationResult.data;

    // Create mock API service (simulating external API)
    const mockApi = new MockApiService();

    // Fetch article from mock API
    const article = await mockApi.fetchArticle(articleId);

    // Transform to our internal format
    const processedData = {
      sourceId: article.id,
      title: article.title,
      content: article.content,
      author: article.author,
      publishedAt: new Date(article.publishedAt),
      tags: article.tags || [],
      wordCount: article.content.split(" ").length,
    };

    // Prepare Inngest event data
    const eventData = {
      sourceId: processedData.sourceId,
      title: processedData.title,
      content: processedData.content,
      author: processedData.author,
      publishedAt: processedData.publishedAt.toISOString(),
      tags: processedData.tags,
      wordCount: processedData.wordCount,
      processingOptions: {
        generateSummary: options?.generateSummary ?? true,
        sendNotification: options?.sendNotification ?? true,
        priority: options?.priority ?? "medium",
      },
    };

    // Send to Inngest for processing
    console.log("📤 Sending to Inngest:", {
      event: "external-data/process",
      data: eventData,
    });

    const result = await inngest.send({
      name: "external-data/process",
      data: eventData,
    });

    return NextResponse.json({
      success: true,
      message: "Article processed and sent to workflow",
      article: {
        id: article.id,
        title: article.title,
        author: article.author,
        wordCount: processedData.wordCount,
        tags: processedData.tags,
      },
      processingOptions: eventData.processingOptions,
      eventId: result.ids[0],
    });
  } catch (error) {
    console.error("Error processing article:", error);
    return NextResponse.json(
      {
        error: "Failed to process article",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
