"use client";

import { useState } from "react";
import Link from "next/link";

export default function ExternalDemo() {
  const [articles, setArticles] = useState<string[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [articleData, setArticleData] = useState<{
    id: string;
    title: string;
    author: string;
    publishedAt: string;
    tags: string[];
    content: string;
  } | null>(null);

  const loadArticles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/mock-articles");
      const data = await response.json();

      if (data.success) {
        setArticles(data.articles);
        setMessage(`Found ${data.count} articles available`);
      } else {
        setMessage("Failed to load articles");
      }
    } catch (error) {
      console.error("Error loading articles:", error);
      setMessage("Error loading articles");
    } finally {
      setIsLoading(false);
    }
  };

  const processArticle = async () => {
    if (!selectedArticle) {
      setMessage("Please select an article first");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");

      // First, fetch the article details
      const articleResponse = await fetch("/api/mock-articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articleId: selectedArticle }),
      });

      const articleData = await articleResponse.json();

      if (!articleData.success) {
        setMessage(`Failed to fetch article: ${articleData.error}`);
        return;
      }

      setArticleData(articleData.article);

      // Then process the article through the workflow
      const processResponse = await fetch("/api/process-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          articleId: selectedArticle,
          options: {
            generateSummary: true,
            sendNotification: true,
            priority: "medium",
          },
        }),
      });

      const processData = await processResponse.json();

      if (processData.success) {
        setMessage(
          `✅ Article processed successfully! Event ID: ${processData.eventId}`
        );
      } else {
        setMessage(`❌ Failed to process article: ${processData.error}`);
      }
    } catch (error) {
      console.error("Error processing article:", error);
      setMessage("Error processing article");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          External API Simulation
        </h1>
        <p className="text-lg text-gray-400">
          Test the complete flow: External API → Validation → Transformation →
          Inngest
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-4xl border border-gray-800">
        <div className="space-y-6">
          {/* Load Articles Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              1. Load Available Articles
            </h2>
            <button
              onClick={loadArticles}
              disabled={isLoading}
              className="bg-white hover:bg-gray-200 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              {isLoading ? "Loading..." : "Load Articles"}
            </button>

            {articles.length > 0 && (
              <div className="mt-4">
                <p className="text-green-400 mb-2">Available Articles:</p>
                <div className="space-y-2">
                  {articles.map((articleId) => (
                    <div
                      key={articleId}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="radio"
                        id={articleId}
                        name="article"
                        value={articleId}
                        onChange={(e) => setSelectedArticle(e.target.value)}
                        className="text-white"
                      />
                      <label htmlFor={articleId} className="text-white">
                        {articleId}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Process Article Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              2. Process Selected Article
            </h2>
            <button
              onClick={processArticle}
              disabled={isLoading || !selectedArticle}
              className="bg-white hover:bg-gray-200 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              {isLoading ? "Processing..." : "Process Article"}
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.includes("✅")
                  ? "bg-green-900 border border-green-700 text-green-200"
                  : message.includes("❌")
                  ? "bg-red-900 border border-red-700 text-red-200"
                  : "bg-blue-900 border border-blue-700 text-blue-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* Article Data Display */}
          {articleData && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                Article Details
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-400">Title:</span>{" "}
                  <span className="text-white">{articleData.title}</span>
                </p>
                <p>
                  <span className="text-gray-400">Author:</span>{" "}
                  <span className="text-white">{articleData.author}</span>
                </p>
                <p>
                  <span className="text-gray-400">Published:</span>{" "}
                  <span className="text-white">
                    {new Date(articleData.publishedAt).toLocaleDateString()}
                  </span>
                </p>
                <p>
                  <span className="text-gray-400">Tags:</span>{" "}
                  <span className="text-white">
                    {articleData.tags?.join(", ")}
                  </span>
                </p>
                <p>
                  <span className="text-gray-400">Content Preview:</span>
                </p>
                <div className="bg-gray-700 p-3 rounded text-gray-300 text-xs max-h-32 overflow-y-auto">
                  {articleData.content.substring(0, 300)}...
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Back to Main App */}
      <div className="mt-8">
        <Link href="/" className="text-gray-400 hover:text-white underline">
          ← Back to Text Summarizer
        </Link>
      </div>
    </div>
  );
}
