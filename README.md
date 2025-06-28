# Meal Planner

A meal planning application that helps users discover and organize meal ideas with AI-powered suggestions. This also serves as a way for me to test building with Claude Code and other AI building tools.

## Project Goal

This application aims to simplify meal planning by providing users with personalized, weekly meal recommendations based on their preferences. The app features an intuitive interface for browsing meal ideas, re-generating meal ideas they don't like, accepting suggestions, and building a customized meal plan. Once locked in for the week, the app can simplify grocery ordering by generating a combined shopping list (and maybe even go further in the future!).

## Current State

The application is in active development with the following features implemented:

- **Frontend**: React with TypeScript, styled with Tailwind CSS
- **UI Components**: Structured meal cards with detailed cooking information, drag-and-drop reordering
- **Backend**: Express.js API server with OpenAI Responses API integration for structured JSON meal generation
- **Schema Validation**: Zod schemas ensure type-safe, structured meal data with ingredients and cooking steps
- **AI Integration**: OpenAI Responses API with strict JSON schema validation and multi-turn conversation support
- **State Management**: React hooks for managing structured meal data and conversation history

### Technology Stack

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Express.js for API server
- OpenAI Responses API for structured meal generation
- Zod for schema validation and type safety
- zod-to-json-schema for JSON Schema conversion
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm (recommended) or npm
- OpenAI API key (for AI features)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd meal-planner
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Add your OpenAI API key to the `.env` file.

### Running the Application

#### Development Mode (Full Stack)
```bash
pnpm dev
```
This runs both the frontend (port 5173) and API server (port 3001) concurrently.

#### Frontend Only
```bash
pnpm dev:frontend
```

#### API Server Only
```bash
pnpm dev:api
```

### Building for Production

```bash
pnpm build
```

### Testing

#### Type Checking
```bash
pnpm type-check
```

#### Linting
```bash
pnpm lint
```

#### Test API Endpoint
```bash
pnpm test:poc
```

### Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx                    # Application header
│   ├── PromptBox.tsx                 # User input component
│   ├── StructuredMealGrid.tsx        # Structured meal grid with drag-and-drop
│   ├── StructuredMealCard.tsx        # Detailed meal cards with editing
│   └── Footer.tsx                    # Application footer
├── types/
│   └── meal.ts                       # Zod schemas and TypeScript types
├── lib/
│   └── openai.ts                     # OpenAI Responses API integration
├── App.tsx                           # Main application component
└── main.tsx                          # Application entry point
server.js                             # Express API server with structured responses
```

## OpenAI Responses API Integration

This application leverages the **OpenAI Responses API** with strict JSON output to generate structured meal data without any string parsing. The integration follows these key principles:

### Schema-Driven Generation

1. **Zod Schema Definition**: Meals are defined using Zod schemas in `src/types/meal.ts`:
   ```typescript
   const Meal = z.object({
     id: z.string(),
     day: z.enum(["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]),
     name: z.string(),
     description: z.string(),
     prepMinutes: z.number(),
     cookMinutes: z.number(),
     ingredients: Ingredient.array().min(1),
     steps: z.array(z.string()).min(1),
     tags: z.array(z.string()).optional(),
   });
   ```

2. **JSON Schema Conversion**: Zod schemas are converted to JSON Schema format using `zod-to-json-schema` for OpenAI API consumption

3. **Strict Validation**: All responses are validated against the Zod schema, ensuring type safety and data consistency

### API Integration Features

- **Ready-to-Render Objects**: Returns `Meal[]` arrays directly—no string parsing required
- **Multi-Turn Conversations**: Maintains conversation history for contextual meal editing
- **Automatic Retry**: Failed schema validation triggers retry with corrective prompt
- **Error Handling**: Zod validation errors are caught and handled gracefully

### Example Usage

```typescript
// Sample prompt from requirements
const samplePrompt = "Plan four dinners for next week (Sun-Thu, Tue is take-out). Dietary prefs: low-effort, toddler-friendly.";

// Returns validated Meal[] objects
const meals = await fetch('/api/generate-meals', {
  method: 'POST',
  body: JSON.stringify({ prompt: samplePrompt })
});
```

### Success Criterion

✅ **Given the sample prompt above, the app renders four dinner cards without any manual parsing code and throws a Zod error if the model ever deviates from the schema.**

## API Endpoints

- `POST /generate-meals` - Generate structured meals using OpenAI Responses API with Zod validation
- `GET /meal-poc` - Legacy test endpoint for basic AI-powered meal suggestions

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

This project is private and not licensed for public use.