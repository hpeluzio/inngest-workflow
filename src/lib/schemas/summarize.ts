import { z } from "zod";

// Schema for text summarization request (for API validation)
export const SummarizeRequestSchema = z.object({
  text: z
    .string()
    .min(10, "Text must be at least 10 characters long")
    .max(10000, "Text must be less than 10,000 characters"),
  email: z.string().email("Please enter a valid email address"),
});

// Type inference from schemas
export type SummarizeRequest = z.infer<typeof SummarizeRequestSchema>;
