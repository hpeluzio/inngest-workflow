import { NextRequest, NextResponse } from "next/server";
import { ExternalApiService } from "@/lib/services/external-api";
import { z } from "zod";

// Schema for API request validation
const ProcessRequestSchema = z.object({
  id: z.string().min(1, "ID is required"),
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

    // 🔍 VALIDATION POINT: Validate API request
    const validationResult = ProcessRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { id, options } = validationResult.data;

    // Initialize external API service
    const apiService = new ExternalApiService(
      process.env.EXTERNAL_API_URL!,
      process.env.EXTERNAL_API_KEY!
    );

    // Process and ingest data
    const result = await apiService.processAndIngest(id, options);

    return NextResponse.json({
      success: true,
      eventId: result.eventId,
      message: "Data processed and sent to workflow",
    });
  } catch (error) {
    console.error("Error processing external data:", error);
    return NextResponse.json(
      { error: "Failed to process external data" },
      { status: 500 }
    );
  }
}
