# Meal Planner - Claude Development Guide

## Project Overview
A React-based meal planning application with OpenAI integration for generating personalized meal suggestions. Users can input dietary preferences and get AI-powered meal recommendations.

## Development Workflow

### REQUIRED: Pre-commit Quality Checks
Claude MUST run these commands before any commit and ensure ALL pass:

```bash
# Core quality gates (ALL must pass)
pnpm lint          # ESLint validation - no errors allowed
pnpm type-check    # TypeScript validation - no type errors
pnpm test          # Full test suite - 100% pass rate required
pnpm build         # Production build - must complete successfully
```

**⚠️ CRITICAL: Never commit if any of these fail**

### Development Commands

```bash
# Development
pnpm dev           # Start dev server (http://localhost:5173)
pnpm build         # Production build
pnpm preview       # Preview production build

# Quality Assurance
pnpm lint          # Run ESLint
pnpm lint:fix      # Auto-fix ESLint issues
pnpm type-check    # TypeScript validation
pnpm test          # Run all tests
pnpm test:coverage # Run tests with coverage report
pnpm test:ui       # Run tests with Vitest UI
pnpm test:watch    # Run tests in watch mode
pnpm test:e2e      # Run Playwright E2E tests
pnpm test:e2e:ui   # Run E2E tests with UI
```

### Server Commands

```bash
# Backend (runs on port 3001)
pnpm server        # Start Express server
pnpm start         # Start both frontend and backend concurrently
```

## Architecture

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, OpenAI API
- **Testing**: Vitest, React Testing Library, Playwright, MSW
- **Linting**: ESLint, TypeScript strict mode

### Key Features
- OpenAI-powered meal suggestion generation
- Input validation (10-500 characters)
- Real-time error handling and loading states
- Responsive design with Tailwind CSS

## Testing Strategy

### Test Structure
- **Unit Tests**: `src/components/__tests__/` - Component behavior and validation
- **Integration Tests**: `src/__tests__/` - Full workflow testing with MSW mocks
- **E2E Tests**: `tests/e2e/` - End-to-end user scenarios with Playwright

### Test Coverage Requirements
- Minimum 80% code coverage
- All new components require unit tests
- All API endpoints require integration tests
- Critical user workflows require E2E tests

### Mock Strategy
- **MSW (Mock Service Worker)**: API mocking for integration tests
- **Test Handlers**: `src/test/mocks/handlers.ts` - Mock API responses
- **No External Calls**: Tests never hit real OpenAI API

### Test Performance
- Unit tests: ~120ms
- Integration tests: ~500ms
- E2E tests: ~2-5s per test
- Full suite: <2s total

## API Integration

### OpenAI Configuration
- Endpoint: `POST /generate-meals`
- Uses OpenAI Responses API (newer pattern)
- Model: `gpt-4o-mini`
- Validation: 10-500 character prompts

### Environment Variables
```bash
# Required for development
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001  # Backend server port
```

### Test Environment
- Tests use MSW mocks (no real API calls)
- Mock responses in `src/test/mocks/handlers.ts`
- Simulates success, error, and network failure scenarios

## Code Quality Standards

### Linting & Formatting
- ESLint configuration in `eslint.config.js`
- TypeScript strict mode enabled
- Automatic formatting with Prettier
- No console.log statements in production code

### Component Patterns
- Functional components with TypeScript
- Props interfaces defined
- Proper error boundaries
- Accessible design patterns

### File Organization
```
src/
├── components/          # React components
│   ├── __tests__/      # Component unit tests
│   └── *.tsx          # Component files
├── __tests__/          # Integration tests
├── test/               # Test utilities and mocks
│   ├── mocks/         # MSW handlers
│   └── setup.ts       # Test setup
└── App.tsx            # Main application
```

## Troubleshooting

### Common Issues

#### Lint Failures
1. Run `pnpm lint:fix` for auto-fixable issues
2. Manually fix remaining ESLint errors
3. Check for unused imports, console.logs, or type issues

#### Test Failures
1. Run `pnpm test:watch` to see real-time failures
2. Check MSW mock handlers if API tests fail
3. Verify component props and state changes
4. Use `pnpm test:ui` for interactive debugging

#### Type Check Failures
1. Run `pnpm type-check` to see specific errors
2. Ensure all props have proper TypeScript interfaces
3. Check for missing type annotations
4. Verify import/export types

#### Build Failures
1. Ensure all quality checks pass first
2. Check for missing dependencies
3. Verify environment variables are set
4. Review Vite configuration

### API Integration Issues
- Verify `OPENAI_API_KEY` is set in environment
- Check server is running on port 3001
- Ensure proxy configuration in `vite.config.ts` is correct
- Review network requests in browser dev tools

## Deployment Notes

### Production Build
- Runs `pnpm build` to create optimized bundle
- Outputs to `dist/` directory
- Includes both frontend and backend builds
- Requires all quality checks to pass

### Environment Setup
- Ensure OpenAI API key is configured
- Set appropriate `NODE_ENV` value
- Configure CORS settings for production domains
- Set up proper error logging

## Performance Considerations

### Frontend
- Vite for fast development builds
- Lazy loading for components
- Optimized bundle size with tree shaking
- Tailwind CSS purging for minimal CSS

### Backend
- Express server with minimal middleware
- Efficient OpenAI API integration
- Proper error handling and timeouts
- Request validation and sanitization

### Testing
- Fast test execution with Vitest
- Parallel test running
- Optimized mock responses
- No external API dependencies in tests

---

## Quick Reference

### Before Every Commit
```bash
pnpm lint && pnpm type-check && pnpm test && pnpm build
```

### Start Development
```bash
pnpm start  # Starts both frontend (5173) and backend (3001)
```

### Run Tests
```bash
pnpm test        # All tests
pnpm test:watch  # Watch mode for development
pnpm test:e2e    # End-to-end tests
```

### Debug Issues
```bash
pnpm test:ui     # Interactive test debugging
pnpm lint:fix    # Auto-fix linting issues
```