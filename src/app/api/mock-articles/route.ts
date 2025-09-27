import { NextRequest, NextResponse } from "next/server";
import { MockApiService } from "@/lib/services/mock-service";

const mockApi = new MockApiService();

// GET /api/mock-articles - Get all available articles
export async function GET() {
  try {
    const articles = await mockApi.getAvailableArticles();
    return NextResponse.json({
      success: true,
      articles,
      count: articles.length,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

// POST /api/mock-articles - Process a specific article
export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json();

    if (!articleId) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    // Fetch article from mock API
    const article = await mockApi.fetchArticle(articleId);

    return NextResponse.json({
      success: true,
      article,
      message: "Article fetched successfully",
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
