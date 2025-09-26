import { NextRequest, NextResponse } from "next/server";
import { sendSummarizeEvent } from "@/lib/events";
import { SummarizeRequestSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod
    const validationResult = SummarizeRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { text, email } = validationResult.data;

    // Send event to Inngest
    const result = await sendSummarizeEvent(text, email);

    return NextResponse.json({
      success: true,
      eventId: result.ids[0],
      message: "Text submitted for summarization",
    });
  } catch (error) {
    console.error("Error sending event:", error);
    return NextResponse.json(
      { error: "Failed to submit text for summarization" },
      { status: 500 }
    );
  }
}
