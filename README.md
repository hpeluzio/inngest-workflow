# Inngest Agent

A comprehensive learning project demonstrating Inngest workflow orchestration through practical AI-powered text summarization. This application showcases event-driven architecture, step-based processing, polling patterns, and real-time status updates.

## Features

- **AI Text Summarization**: Powered by OpenAI GPT models
- **Real-time Status Updates**: Polling-based progress tracking
- **Email Notifications**: Automated summary delivery
- **Dark Mode UI**: Clean, modern interface with Tailwind CSS v4
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Type Safety**: Full TypeScript implementation with Zod validation

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Workflow Orchestration**: Inngest
- **AI Integration**: OpenAI API
- **Validation**: Zod schemas
- **Package Manager**: pnpm

## Architecture Overview

```
┌─────────────┐    Event     ┌─────────────┐    HTTP     ┌─────────────┐
│   Frontend  │ ──────────► │   Inngest   │ ──────────► │    API      │
│  (React)    │             │ (Workflows) │             │ (Status)    │
└─────────────┘             └─────────────┘             └─────────────┘
     │                             │                           │
     │ Polling                     │ Steps                     │ Store
     │ GET /api/status             │ 1. Generate Summary       │ Results
     │                             │ 2. Send Email             │
     │                             │ 3. Store Result           │
     ▼                             ▼                           ▼
┌─────────────┐             ┌─────────────┐             ┌─────────────┐
│   Browser   │             │   OpenAI    │             │ In-Memory   │
│             │             │             │             │    Store    │
└─────────────┘             └─────────────┘             └─────────────┘
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) - install globally with `npm install -g pnpm`

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd inngest-agent
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp env.example .env.local
```

4. Start the development server:

```bash
pnpm dev
```

5. Start Inngest Dev Server (in another terminal):

```bash
inngest dev
```

6. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Setup

### Required Environment Variables

Create a `.env.local` file in the project root:

```bash
# Required for AI summarization
OPENAI_API_KEY=your_openai_api_key_here

# Optional for Inngest (development works without these)
INNGEST_EVENT_KEY=your_inngest_event_key_here
INNGEST_SIGNING_KEY=your_inngest_signing_key_here
```

### OpenAI Configuration

1. Get your OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)
2. Add it to your `.env.local` file

### Inngest Setup

1. Sign up at [inngest.com](https://inngest.com)
2. Create a new app and get your keys
3. Add environment variables (optional for development)

For local development, you can run without Inngest keys - the workflows will execute locally.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── inngest/route.ts                    # Inngest API endpoint
│   │   ├── summarize/route.ts                  # Text summarization endpoint
│   │   └── summarize/status/[eventId]/route.ts # Status polling endpoint
│   ├── external-demo/page.tsx                  # External API demo
│   ├── globals.css                             # Global styles
│   ├── layout.tsx                              # App layout
│   └── page.tsx                                # Main page component
├── lib/
│   ├── functions/
│   │   └── summarize.ts                        # Text summarization workflow
│   ├── services/
│   │   ├── openai.ts                           # OpenAI integration
│   │   └── mock-service.ts                     # Mock external API
│   ├── schemas/
│   │   ├── index.ts                            # Main schemas
│   │   └── external-api.ts                     # External API schemas
│   ├── events.ts                               # Event utilities
│   └── inngest.ts                              # Inngest client configuration
```

## Usage

### Basic Text Summarization

1. **Enter Text**: Paste or type the text you want to summarize
2. **Add Email**: Provide your email for notifications
3. **Submit**: Click "Summarize" to start the workflow
4. **Processing**: The app shows loading state while processing
5. **Real-time Updates**: Status updates via polling every 2 seconds
6. **Summary**: View the generated summary on screen
7. **Back**: Return to create a new summary

### External API Demo

Visit `/external-demo` to see:

- Mock external API integration
- Data validation and transformation
- Inngest workflow processing
- Error handling examples

## Inngest Concepts Demonstrated

### 1. Event-Driven Architecture

```typescript
// Trigger workflow with event
await inngest.send({
  name: "text/summarize",
  data: { text, email },
});
```

### 2. Step-Based Processing

```typescript
// Break workflow into steps
const summary = await step.run("generate-ai-summary", async () => {
  return await OpenAIService.generateSummary(text);
});

await step.run("send-notification", async () => {
  // Send email notification
});

await step.run("store-result", async () => {
  // Store result for polling
});
```

### 3. Error Handling & Retries

```typescript
// Automatic retries on failure
await step.run("generate-ai-summary", async () => {
  try {
    return await OpenAIService.generateSummary(text);
  } catch (error) {
    // Fallback strategy
    return `Summary of your text: ${text.substring(0, 200)}...`;
  }
});
```

### 4. Polling Pattern

```typescript
// Frontend polls for status
const response = await fetch(`/api/summarize/status/${eventId}`);
const data = await response.json();
```

## Development

### Running the Application

1. **Development Server**: `pnpm dev`
2. **Inngest Dev Server**: `inngest dev`
3. **Linting**: `pnpm lint`

### Key Development Features

- **Hot Reload**: Changes reflect immediately
- **Type Safety**: Full TypeScript support
- **Error Boundaries**: Graceful error handling
- **Responsive Design**: Mobile-first approach

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/inngest-agent)

### Environment Variables for Production

```bash
OPENAI_API_KEY=your_production_openai_key
INNGEST_EVENT_KEY=your_production_inngest_event_key
INNGEST_SIGNING_KEY=your_production_inngest_signing_key
```

## Learning Resources

- [Inngest Documentation](https://www.inngest.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [Zod Validation](https://zod.dev/)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Inngest](https://inngest.com) for workflow orchestration
- [OpenAI](https://openai.com) for AI capabilities
- [Vercel](https://vercel.com) for deployment platform
- [Tailwind CSS](https://tailwindcss.com) for styling
