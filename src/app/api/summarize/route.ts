import { NextRequest, NextResponse } from "next/server";
import { sendSummarizeEvent } from "@/lib/events";

export async function POST(request: NextRequest) {
  try {
    const { text, email } = await request.json();

    if (!text || !email) {
      return NextResponse.json(
        { error: "Text and email are required" },
        { status: 400 }
      );
    }

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
