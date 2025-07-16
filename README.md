# 🍽️ AI Meal Planner

*Where culinary creativity meets artificial intelligence*

Welcome to the **AI Meal Planner** – a delightfully intelligent meal planning application that transforms the age-old question "What's for dinner?" into an exciting culinary adventure! 🎨👨‍🍳

## ✨ What This App Does

Gone are the days of staring blankly into your fridge wondering what to cook. This React-powered meal planning assistant uses the magic of OpenAI's structured response API to generate personalized meal suggestions that actually make sense for your life.

Simply tell the app what you're craving – whether it's "low-effort toddler-friendly dinners for the week" or "fancy weekend brunch ideas" – and watch as it crafts detailed, actionable meal plans complete with ingredients, prep times, and step-by-step instructions.

### 🎯 Key Features That Make Meal Planning Actually Fun

- **🧠 AI-Powered Intelligence**: Uses OpenAI's latest structured response API for consistently perfect meal suggestions
- **🎲 Smart Reroll System**: Don't like a suggestion? Hit the reroll button for instant alternatives
- **✏️ Edit-in-Place**: Modify any meal with natural language ("make this vegetarian", "reduce prep time")
- **🎨 Beautiful UI**: Clean, responsive design that makes meal planning feel like a breeze
- **⚡ Lightning Fast**: Optimized for speed with smart caching and efficient API calls
- **🔒 Type-Safe**: Built with TypeScript and Zod validation for bulletproof reliability

## 📸 See It In Action

### Main Interface - Simple Yet Powerful
<img width="1186" height="788" src="https://github.com/user-attachments/assets/bd99c99b-af58-46ca-b134-61cfa3bf977e" alt="Main meal planner interface showing the input prompt and generated meal suggestions" />

*The heart of the app: A clean prompt interface that transforms your ideas into structured meal plans*

### Rich Meal Cards - Every Detail Matters
<img width="1136" height="780" src="https://github.com/user-attachments/assets/410a6a01-2f01-49c2-9b23-8c61dc941a83" alt="Detailed meal cards showing ingredients, prep times, and cooking instructions" />

*Each meal comes with everything you need: ingredients, timing, and clear step-by-step instructions*

## 🛠️ Technical Stack

This application showcases modern web development practices with a carefully curated tech stack:

### Frontend Architecture
- **⚛️ React 18** - Latest React with concurrent features
- **🔷 TypeScript** - Full type safety from components to API calls
- **⚡ Vite** - Lightning-fast development and optimized builds
- **🎨 Tailwind CSS** - Utility-first styling for consistent design
- **🎭 Lucide React** - Beautiful, consistent icons

### Backend & API
- **🚀 Express.js** - Minimal, fast Node.js server
- **🤖 OpenAI API** - Structured response generation with JSON Schema
- **🛡️ Zod** - Runtime validation and type safety
- **🔄 Schema Validation** - End-to-end type safety from AI to UI

### Testing & Quality
- **🧪 Vitest** - Modern, fast testing framework
- **🎭 Playwright** - End-to-end testing for real user workflows
- **🔍 React Testing Library** - Component testing best practices
- **🎯 MSW** - Mock Service Worker for API testing
- **✅ ESLint** - Code quality and consistency
- **📊 Coverage Reports** - Comprehensive test coverage tracking

### Development Tools
- **📦 pnpm** - Fast, efficient package management
- **🔧 Concurrently** - Run frontend and backend simultaneously
- **🎨 PostCSS** - CSS processing and optimization
- **🔄 Hot Module Replacement** - Instant development feedback

## 🚀 Getting Started

### Prerequisites

You'll need these tools installed:
- **Node.js** (v18 or later) - [Download here](https://nodejs.org/)
- **pnpm** (recommended) - `npm install -g pnpm`
- **OpenAI API key** - [Get yours here](https://platform.openai.com/api-keys)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/ShaunHardin/meal-planner.git
cd meal-planner

# Install dependencies (this is fast with pnpm!)
pnpm install

# Set up your environment
cp .env.example .env
# Add your OpenAI API key to .env

# Start the magic ✨
pnpm start
```

That's it! Your meal planner will be running at `http://localhost:5173` with the API server on port 3001.

### Development Commands

```bash
# Start everything (recommended)
pnpm start              # Frontend + Backend concurrently

# Individual services
pnpm dev:frontend       # Just the React app (port 5173)
pnpm dev:api           # Just the Express server (port 3001)

# Quality assurance
pnpm lint              # Check code quality
pnpm type-check        # Validate TypeScript
pnpm test              # Run all tests
pnpm test:coverage     # Test coverage report
pnpm test:e2e          # End-to-end tests

# Production
pnpm build             # Build for production
pnpm preview           # Preview production build
```

## 🤖 Claude Code Integration

This project showcases cutting-edge AI development workflows with **Claude Code** – an intelligent development assistant that helps maintain code quality and accelerate development.

### How Claude Code Works Here

**💬 Interactive Development**
- Comment `@claude` on any issue or PR to get intelligent assistance
- Claude analyzes the entire codebase context before making suggestions
- Follows project-specific guidelines from `CLAUDE.md`

**🔍 Automated Code Reviews**
- Every pull request gets an automatic Claude review
- Checks for bugs, security issues, and best practices
- Provides constructive feedback with specific suggestions
- Maintains consistency with project coding standards

**⚡ GitHub Actions Integration**
- Seamlessly integrated via GitHub Actions workflows
- Runs with appropriate permissions and access controls
- Supports parallel work on multiple issues and PRs
- Respects branch protection rules

### Claude Code Features in This Project

```yaml
# .github/workflows/claude.yml
triggers:
  - Issue comments with @claude
  - Pull request reviews mentioning @claude
  - New issues assigned to Claude
  - Review comments with @claude

capabilities:
  - Code analysis and suggestions
  - Automated testing and quality checks
  - Pull request creation and management
  - TypeScript and React best practices
  - Full project context awareness
```

### Quality Gates

Claude Code enforces these quality standards:

```bash
# Required before any commit
pnpm lint           # ✅ Code style and quality
pnpm type-check     # ✅ TypeScript validation
pnpm test           # ✅ All tests passing
pnpm build          # ✅ Production build success
```

**🚫 Zero tolerance policy**: No commits are allowed unless all quality checks pass.

## 📁 Project Structure

```
meal-planner/
├── 📱 Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/          # UI components
│   │   │   ├── Header.tsx       # App header with branding
│   │   │   ├── PromptBox.tsx    # AI prompt input
│   │   │   ├── StructuredMealGrid.tsx  # Meal grid with drag-and-drop
│   │   │   ├── StructuredMealCard.tsx  # Individual meal cards
│   │   │   └── AIChefLoading.tsx       # Delightful loading states
│   │   ├── types/               # TypeScript types & Zod schemas
│   │   ├── lib/                 # OpenAI integration utilities
│   │   └── __tests__/           # Component and integration tests
│   ├── tests/e2e/               # Playwright end-to-end tests
│   └── public/                  # Static assets
├── 🔧 Backend (Express.js)
│   ├── server.js                # Main API server
│   └── API endpoints:
│       ├── /api/generate-meals  # AI meal generation
│       └── /api/reroll-meal     # Single meal regeneration
├── 🤖 Claude Code Integration
│   ├── .github/workflows/
│   │   ├── claude.yml           # Main Claude workflow
│   │   └── claude-code-review.yml  # Automated PR reviews
│   └── CLAUDE.md                # Development guidelines for Claude
├── 📦 Configuration
│   ├── vite.config.ts           # Vite build configuration
│   ├── tailwind.config.js       # Tailwind CSS setup
│   ├── eslint.config.js         # Code quality rules
│   └── vitest.config.ts         # Test configuration
└── 📚 Documentation
    ├── README.md                # This file!
    └── .env.example             # Environment template
```

## 🧪 Testing Strategy

This project takes testing seriously with a multi-layered approach:

### Test Types

**🔬 Unit Tests** (`src/components/__tests__/`)
- Individual component behavior
- Props validation and rendering
- User interaction handling
- Fast execution (~120ms)

**🔗 Integration Tests** (`src/__tests__/`)
- Full user workflows
- API endpoint integration
- MSW mock service workers
- Real data flow validation

**🎭 End-to-End Tests** (`tests/e2e/`)
- Complete user journeys
- Cross-browser compatibility
- Real network conditions
- UI interaction validation

### Test Coverage Goals

- **Minimum 80% code coverage** across all modules
- **All new features** require accompanying tests
- **API endpoints** must have integration test coverage
- **Critical user paths** covered by E2E tests

## 🎯 AI Integration Deep Dive

### OpenAI Structured Response API

This app leverages OpenAI's latest structured response capabilities for reliable, parseable meal generation:

```typescript
// Zod schema defines the structure
const Meal = z.object({
  id: z.string(),
  day: z.enum(["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]),
  name: z.string(),
  description: z.string(),
  prepMinutes: z.number(),
  cookMinutes: z.number(),
  ingredients: Ingredient.array().min(1),
  steps: z.array(z.string()).min(1),
});

// OpenAI returns structured JSON that validates against this schema
const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  response_format: { type: "json_schema", json_schema: mealSchema },
  messages: conversationHistory
});
```

### Why This Approach Rocks

- **🚫 No string parsing** - Direct JSON objects from AI
- **✅ Type safety** - Zod validation ensures data integrity
- **💬 Conversation context** - Multi-turn conversations for meal editing
- **🔄 Automatic retries** - Failed validations trigger corrective prompts
- **⚡ Performance** - Optimized for speed with 30s timeouts

## 🚀 Deployment

### Production Build

```bash
# Full production build with quality checks
pnpm deploy:railway

# Manual build process
pnpm lint && pnpm type-check && pnpm test && pnpm build
```

### Environment Variables

```bash
# Required for production
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production
PORT=3001

# Optional optimizations
OPENAI_REQUEST_TIMEOUT=30000
OPENAI_MAX_RETRIES=1
```

## 🤝 Contributing

We welcome contributions! This project is set up for collaborative development with Claude Code assistance.

### Development Workflow

1. **Create a feature branch** from `main`
2. **Make your changes** following the patterns in the codebase
3. **Run quality checks**: `pnpm lint && pnpm type-check && pnpm test && pnpm build`
4. **Submit a pull request** - Claude will automatically review it!
5. **Address feedback** from both Claude and human reviewers
6. **Merge via GitHub UI** once approved

### Getting Help

- **💬 Ask Claude**: Comment `@claude` on any issue or PR for assistance
- **🔍 Check CLAUDE.md**: Contains detailed development guidelines
- **🧪 Run tests**: `pnpm test:watch` for real-time feedback
- **📊 Check coverage**: `pnpm test:coverage` to see test gaps

## 📄 License

This project is private and not licensed for public use.

---

*Built with ❤️ by humans and 🤖 by Claude Code - where AI meets artisanal software development*