import { inngest } from "./inngest";

// Function to send text summarization event
export async function sendSummarizeEvent(text: string, email: string) {
  return await inngest.send({
    name: "text/summarize",
    data: {
      text,
      email,
    },
  });
}
