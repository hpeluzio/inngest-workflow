import { ExternalApiResponse } from "@/lib/schemas";
import { mockArticles } from "@/lib/mocks";

// Mock API service that simulates external API calls
export class MockApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor(
    baseUrl: string = "https://api.mock-news.com",
    apiKey: string = "mock-key"
  ) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * Simulate fetching an article by ID
   */
  async fetchArticle(id: string): Promise<ExternalApiResponse> {
    // Simulate network delay
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 1000)
    );

    // Simulate API errors occasionally
    if (Math.random() < 0.1) {
      throw new Error(`API Error: Article ${id} not found`);
    }

    const article = mockArticles.find((a) => a.id === id);

    if (!article) {
      throw new Error(`Article with ID ${id} not found`);
    }

    // Simulate rate limiting occasionally
    if (Math.random() < 0.05) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    return article as ExternalApiResponse;
  }

  /**
   * Get all available article IDs
   */
  async getAvailableArticles(): Promise<string[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockArticles.map((article) => article.id);
  }

  /**
   * Simulate API health check
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
    };
  }
}
