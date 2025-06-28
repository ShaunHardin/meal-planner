# Meal Planner

A meal planning application that helps users discover and organize meal ideas with AI-powered suggestions. This also serves as a way for me to test building with Claude Code and other AI building tools.

## Project Goal

This application aims to simplify meal planning by providing users with personalized, weekly meal recommendations based on their preferences. The app features an intuitive interface for browsing meal ideas, re-generating meal ideas they don't like, accepting suggestions, and building a customized meal plan. Once locked in for the week, the app can simplify grocery ordering by generating a combined shopping list (and maybe even go further in the future!).

## Current State

The application is in active development with the following features implemented:

- **Frontend**: React with TypeScript, styled with Tailwind CSS
- **UI Components**: Meal cards, prompt input, grid layout, and interactive animations
- **Backend**: Express.js API server with OpenAI integration for AI-powered meal suggestions
- **Mock Data**: Sample meal ideas for development and testing
- **State Management**: React hooks for managing meal suggestions and user interactions

### Technology Stack

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Express.js for API server
- OpenAI API for AI-powered suggestions
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
│   ├── Header.tsx      # Application header
│   ├── PromptBox.tsx   # User input component
│   ├── MealGrid.tsx    # Meal suggestions grid
│   ├── MealCard.tsx    # Individual meal card
│   └── Footer.tsx      # Application footer
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
server.js               # Express API server
```

## API Endpoints

- `GET /meal-poc` - Test endpoint for AI-powered meal suggestions

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

This project is private and not licensed for public use.