import { z } from "zod";

// Schema for external API responses (e.g., from a third-party service)
export const ExternalApiResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  author: z.string(),
  publishedAt: z.union([
    z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid datetime string",
    }),
    z.date(),
  ]),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// Schema for processed data before sending to Inngest
export const ProcessedDataSchema = z.object({
  sourceId: z.string(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  author: z.string().min(1, "Author is required"),
  publishedAt: z.date(),
  tags: z.array(z.string()).default([]),
  summary: z.string().optional(),
  wordCount: z.number().positive(),
});

// Schema for Inngest event data (what gets sent to workflows)
export const InngestEventDataSchema = z.object({
  sourceId: z.string(),
  title: z.string(),
  content: z.string(),
  author: z.string(),
  publishedAt: z.string().datetime(),
  tags: z.array(z.string()),
  summary: z.string().optional(),
  wordCount: z.number(),
  processingOptions: z.object({
    generateSummary: z.boolean().default(true),
    sendNotification: z.boolean().default(true),
    priority: z.enum(["low", "medium", "high"]).default("medium"),
  }),
});

// Type inference
export type ExternalApiResponse = z.infer<typeof ExternalApiResponseSchema>;
export type ProcessedData = z.infer<typeof ProcessedDataSchema>;
export type InngestEventData = z.infer<typeof InngestEventDataSchema>;
