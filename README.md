# AI Text Summarizer

A modern, dark-themed AI text summarization application built with Next.js and powered by Inngest workflow orchestration.

## Features

- **Dark Mode UI**: Clean, minimalist black and white design
- **Text Summarization**: Submit text for AI-powered summarization
- **Email Notifications**: Receive summaries via email
- **Workflow Orchestration**: Powered by Inngest for reliable background processing
- **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Workflow**: Inngest for event-driven processing
- **Package Manager**: pnpm

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

3. Start the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Setup

### OpenAI Configuration

This application uses OpenAI for AI-powered text summarization:

1. Get your OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)
2. Create a `.env.local` file in the project root:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### Inngest Setup

This application uses Inngest for workflow orchestration. To set up Inngest:

1. Sign up at [inngest.com](https://inngest.com)
2. Create a new app and get your keys
3. Add environment variables (optional for development):

```bash
INNGEST_EVENT_KEY=your_event_key
INNGEST_SIGNING_KEY=your_signing_key
```

For local development, you can run without Inngest keys - the workflows will execute locally.

### Environment Variables

Copy `env.example` to `.env.local` and configure:

```bash
# Required for AI summarization
OPENAI_API_KEY=your_openai_api_key_here

# Optional for Inngest (development works without these)
INNGEST_EVENT_KEY=your_inngest_event_key_here
INNGEST_SIGNING_KEY=your_inngest_signing_key_here

# Optional for external API integration
EXTERNAL_API_URL=https://api.example.com
EXTERNAL_API_KEY=your_external_api_key_here
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── inngest/route.ts    # Inngest API endpoint
│   │   └── summarize/route.ts  # Custom API endpoint
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # App layout
│   └── page.tsx                # Main page component
├── lib/
│   ├── functions/
│   │   └── summarize.ts        # Text summarization workflow
│   ├── events.ts               # Event utilities
│   └── inngest.ts             # Inngest client configuration
```

## Usage

1. **Enter Text**: Paste or type the text you want to summarize
2. **Add Email**: Provide your email for notifications
3. **Submit**: Click "Summarize" to start the workflow
4. **Processing**: The app shows loading state while processing
5. **Notification**: You'll receive an email when the summary is ready

## Development

The application uses:

- **Next.js App Router** for modern React patterns
- **Tailwind CSS v4** for styling with custom dark theme
- **Inngest** for reliable background job processing
- **TypeScript** for type safety

## Deployment

Deploy to Vercel for the easiest setup:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/inngest-agent)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
