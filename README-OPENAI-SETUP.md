# OpenAI Integration Setup

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env.local
   # Add your OpenAI API key to .env.local
   ```

3. **Development:**
   ```bash
   pnpm dev          # Runs both frontend and API server
   pnpm lint         # Lint code
   pnpm type-check   # TypeScript check
   pnpm test:poc     # Quick API sanity check
   ```

## Environment Variables

Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_actual_api_key_here
```

The `.env.local` file is git-ignored to keep your API key secure.

## Testing

- **UI Test:** Run `pnpm dev`, then click "Test OpenAI" button in the app
- **API Test:** Run `pnpm test:poc` to test the endpoint directly