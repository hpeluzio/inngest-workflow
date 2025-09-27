"use client";

import { useState } from "react";
import { SummarizeRequestSchema } from "@/lib/schemas";

export default function Home() {
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setErrors({});

    // Client-side validation with Zod
    const validationResult = SummarizeRequestSchema.safeParse({ text, email });

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Send event to Inngest via our API
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          email,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(
          "Text submitted for summarization! You'll receive an email when it's ready."
        );
        setText("");
        setEmail("");
      } else {
        setMessage(result.error || "Error submitting text. Please try again.");
        if (result.details) {
          const fieldErrors: Record<string, string> = {};
          result.details.forEach(
            (error: { path: string[]; message: string }) => {
              if (error.path[0]) {
                fieldErrors[error.path[0]] = error.message;
              }
            }
          );
          setErrors(fieldErrors);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error submitting text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          AI Text Summarizer
        </h1>
        <p className="text-lg text-gray-400">
          Powered by Inngest workflow orchestration
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-2xl border border-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Text Area */}
          <div>
            <label
              htmlFor="text-input"
              className="block text-sm font-medium text-white mb-2"
            >
              Enter text to summarize
            </label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text here..."
              className={`w-full h-64 p-4 bg-gray-800 border rounded-lg resize-none focus:ring-2 focus:ring-white focus:border-white outline-none transition-all duration-200 text-white placeholder-gray-400 ${
                errors.text ? "border-red-500" : "border-gray-700"
              }`}
              required
            />
            {errors.text && (
              <p className="mt-1 text-sm text-red-400">{errors.text}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email-input"
              className="block text-sm font-medium text-white mb-2"
            >
              Email for notifications
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className={`w-full p-4 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-white focus:border-white outline-none transition-all duration-200 text-white placeholder-gray-400 ${
                errors.email ? "border-red-500" : "border-gray-700"
              }`}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.includes("Error")
                  ? "bg-red-900 border border-red-700 text-red-200"
                  : "bg-green-900 border border-green-700 text-green-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-white hover:bg-gray-200 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-medium py-3 px-8 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {isLoading ? "Processing..." : "Summarize"}
            </button>
          </div>
        </form>
      </div>

      {/* Demo Links */}
      <div className="mt-8 flex justify-center">
        <a
          href="/external-demo"
          className="text-gray-400 hover:text-white underline"
        >
          🚀 Try External API Demo
        </a>
      </div>
    </div>
  );
}
