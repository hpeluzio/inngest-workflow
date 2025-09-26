import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { summarizeText } from "@/lib/functions/summarize";

// Create an API route that serves Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [summarizeText],
});
