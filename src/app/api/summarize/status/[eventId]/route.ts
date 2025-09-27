import { NextRequest, NextResponse } from "next/server";

// In-memory storage for workflow results (in production, use Redis or database)
const workflowResults = new Map<
  string,
  {
    status: "processing" | "completed" | "failed";
    summary?: string;
    error?: string;
    completedAt?: string;
  }
>();

// Function to store workflow result (called by Inngest workflow)
export function storeWorkflowResult(
  eventId: string,
  result: {
    status: "completed" | "failed";
    summary?: string;
    error?: string;
  }
) {
  workflowResults.set(eventId, {
    ...result,
    completedAt: new Date().toISOString(),
  });
}

// API endpoint to check workflow status
export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const { eventId } = params;

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const result = workflowResults.get(eventId);

    if (!result) {
      return NextResponse.json({
        eventId,
        status: "processing",
        message: "Workflow not found or still processing",
      });
    }

    return NextResponse.json({
      eventId,
      status: result.status,
      summary: result.summary,
      error: result.error,
      completedAt: result.completedAt,
    });
  } catch (error) {
    console.error("Error checking workflow status:", error);
    return NextResponse.json(
      { error: "Failed to check workflow status" },
      { status: 500 }
    );
  }
}
