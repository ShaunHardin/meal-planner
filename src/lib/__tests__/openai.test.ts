import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MealPlannerAI } from '../openai';

// Mock OpenAI
const mockOpenAI = {
  responses: {
    create: vi.fn(),
  },
};

vi.mock('openai', () => ({
  default: vi.fn(() => mockOpenAI),
}));

const mockMealResponse = {
  meals: [
    {
      id: 'meal-1',
      day: 'Mon',
      name: 'Grilled Chicken',
      description: 'Healthy grilled chicken dinner',
      prepMinutes: 10,
      cookMinutes: 20,
      ingredients: [{ item: 'chicken breast', quantity: '2 pieces' }],
      steps: ['Season chicken', 'Grill for 20 minutes']
    }
  ]
};

describe('MealPlannerAI', () => {
  let mealPlanner: MealPlannerAI;

  beforeEach(() => {
    vi.clearAllMocks();
    mealPlanner = new MealPlannerAI('test-api-key');
  });

  describe('constructor', () => {
    it('creates instance with API key', () => {
      expect(mealPlanner).toBeInstanceOf(MealPlannerAI);
    });
  });

  describe('generateMeals', () => {
    it('generates meals successfully', async () => {
      mockOpenAI.responses.create.mockResolvedValue({
        output_text: JSON.stringify(mockMealResponse)
      });

      const result = await mealPlanner.generateMeals('Generate 1 healthy meal');

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'meal-1',
        name: 'Grilled Chicken',
        day: 'Mon'
      });
    });

    it('calls OpenAI with correct parameters', async () => {
      mockOpenAI.responses.create.mockResolvedValue({
        output_text: JSON.stringify(mockMealResponse)
      });

      await mealPlanner.generateMeals('Generate meals');

      expect(mockOpenAI.responses.create).toHaveBeenCalledWith({
        model: 'gpt-4o-mini',
        instructions: expect.stringContaining('expert meal-planning engine'),
        text: {
          format: {
            type: 'json_schema',
            name: 'meals',
            schema: expect.objectContaining({
              type: 'object',
              properties: expect.objectContaining({
                meals: expect.any(Object)
              })
            })
          }
        },
        input: 'Generate meals'
      });
    });

    it('builds input with conversation history', async () => {
      mockOpenAI.responses.create.mockResolvedValue({
        output_text: JSON.stringify(mockMealResponse)
      });

      // First call to build history
      await mealPlanner.generateMeals('First request');
      
      // Second call should include history
      await mealPlanner.generateMeals('Second request');

      const secondCall = mockOpenAI.responses.create.mock.calls[1][0];
      expect(secondCall.input).toContain('user: First request');
      expect(secondCall.input).toContain('assistant:');
      expect(secondCall.input).toContain('user: Second request');
    });

    it('handles missing output text', async () => {
      mockOpenAI.responses.create.mockResolvedValue({});

      await expect(mealPlanner.generateMeals('test'))
        .rejects
        .toThrow('No output received from OpenAI');
    });

    it('handles JSON parsing errors with retry', async () => {
      mockOpenAI.responses.create
        .mockResolvedValueOnce({ output_text: 'invalid json' })
        .mockResolvedValueOnce({ output_text: JSON.stringify(mockMealResponse) });

      const result = await mealPlanner.generateMeals('test prompt');

      expect(result).toHaveLength(1);
      expect(mockOpenAI.responses.create).toHaveBeenCalledTimes(2);
      
      // Second call should have retry prompt
      const retryCall = mockOpenAI.responses.create.mock.calls[1][0];
      expect(retryCall.input).toContain('**Fix the JSON so it matches the schema exactly.**');
    });

    it('throws error after failed retry', async () => {
      mockOpenAI.responses.create
        .mockResolvedValueOnce({ output_text: 'invalid json' })
        .mockResolvedValueOnce({ output_text: 'still invalid' });

      await expect(mealPlanner.generateMeals('test'))
        .rejects
        .toThrow();

      expect(mockOpenAI.responses.create).toHaveBeenCalledTimes(2);
    });

    it('validates response against schema', async () => {
      const invalidResponse = {
        meals: [{
          id: 'meal-1',
          // Missing required fields
        }]
      };

      mockOpenAI.responses.create.mockResolvedValue({
        output_text: JSON.stringify(invalidResponse)
      });

      await expect(mealPlanner.generateMeals('test'))
        .rejects
        .toThrow();
    });
  });

  describe('editMeals', () => {
    it('calls generateMeals with edit prompt', async () => {
      mockOpenAI.responses.create.mockResolvedValue({
        output_text: JSON.stringify(mockMealResponse)
      });

      const spy = vi.spyOn(mealPlanner, 'generateMeals');
      await mealPlanner.editMeals('Make it vegetarian');

      expect(spy).toHaveBeenCalledWith('Make it vegetarian');
    });
  });

  describe('history management', () => {
    beforeEach(async () => {
      mockOpenAI.responses.create.mockResolvedValue({
        output_text: JSON.stringify(mockMealResponse)
      });
    });

    it('starts with empty history', () => {
      expect(mealPlanner.getHistory()).toHaveLength(0);
    });

    it('adds entries to history after successful generation', async () => {
      await mealPlanner.generateMeals('test prompt');

      const history = mealPlanner.getHistory();
      expect(history).toHaveLength(2);
      expect(history[0]).toEqual({ role: 'user', content: 'test prompt' });
      expect(history[1]).toEqual({ 
        role: 'assistant', 
        content: JSON.stringify(mockMealResponse)
      });
    });

    it('clears history', async () => {
      await mealPlanner.generateMeals('test prompt');
      expect(mealPlanner.getHistory()).toHaveLength(2);

      mealPlanner.clearHistory();
      expect(mealPlanner.getHistory()).toHaveLength(0);
    });

    it('returns copy of history to prevent mutation', async () => {
      await mealPlanner.generateMeals('test prompt');
      
      const history1 = mealPlanner.getHistory();
      const history2 = mealPlanner.getHistory();
      
      expect(history1).not.toBe(history2);
      expect(history1).toEqual(history2);
    });
  });

  describe('buildInputWithHistory', () => {
    it('returns prompt as-is with empty history', async () => {
      mockOpenAI.responses.create.mockResolvedValue({
        output_text: JSON.stringify(mockMealResponse)
      });

      await mealPlanner.generateMeals('simple prompt');

      const firstCall = mockOpenAI.responses.create.mock.calls[0][0];
      expect(firstCall.input).toBe('simple prompt');
    });

    it('formats history correctly with multiple exchanges', async () => {
      mockOpenAI.responses.create.mockResolvedValue({
        output_text: JSON.stringify(mockMealResponse)
      });

      await mealPlanner.generateMeals('First request');
      await mealPlanner.generateMeals('Second request');

      const secondCall = mockOpenAI.responses.create.mock.calls[1][0];
      expect(secondCall.input).toMatch(
        /user: First request\n\nassistant: .*\n\nuser: Second request/
      );
    });
  });
});