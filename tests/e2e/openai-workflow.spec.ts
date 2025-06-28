import { test, expect } from '@playwright/test';

test.describe('OpenAI Meal Generation Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Set up API interception to mock OpenAI responses
    await page.route('/api/generate-meals', async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();
      
      // Simulate validation errors
      if (!postData.prompt || postData.prompt.trim().length < 10) {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Prompt must be at least 10 characters long' }),
        });
        return;
      }
      
      if (postData.prompt.length > 500) {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Prompt must be 500 characters or less' }),
        });
        return;
      }
      
      // Simulate API error
      if (postData.prompt.includes('trigger-error')) {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'OpenAI API error occurred' }),
        });
        return;
      }
      
      // Successful response
      const mockResponse = `Here are 4 personalized meal suggestions based on your request: "${postData.prompt}"

1. **Mediterranean Quinoa Bowl**
   - Quinoa with cucumber, tomatoes, olives, and feta
   - Light lemon-herb dressing
   - Prep time: 15 minutes

2. **Asian-Style Lettuce Wraps**
   - Ground turkey with ginger, soy sauce, and vegetables
   - Served in butter lettuce cups
   - Prep time: 20 minutes

3. **One-Pan Salmon and Vegetables**
   - Baked salmon with seasonal roasted vegetables
   - Simple herb seasoning
   - Prep time: 25 minutes

4. **Vegetarian Black Bean Tacos**
   - Seasoned black beans with avocado and salsa
   - Whole wheat tortillas
   - Prep time: 10 minutes

All meals are designed to be nutritious, flavorful, and quick to prepare!`;

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: mockResponse }),
      });
    });

    await page.goto('/');
  });

  test('completes successful meal generation workflow', async ({ page }) => {
    // 1. User enters a valid prompt
    const promptInput = page.getByLabel(/describe the dinners/i);
    await promptInput.fill('I need 4 healthy and quick meals for busy weeknights');

    // 2. Generate button becomes enabled
    const generateButton = page.getByRole('button', { name: /generate ideas/i });
    await expect(generateButton).toBeEnabled();

    // 3. User clicks generate button
    await generateButton.click();

    // 4. Loading state appears
    await expect(page.getByText('Generating Ideas...')).toBeVisible();
    await expect(page.getByText('Generating personalized meal suggestions...')).toBeVisible();

    // 5. AI response appears with meal suggestions
    await expect(page.getByText('AI Meal Suggestions')).toBeVisible();
    await expect(page.getByText('Mediterranean Quinoa Bowl')).toBeVisible();
    await expect(page.getByText('Asian-Style Lettuce Wraps')).toBeVisible();

    // 6. Meal grid also appears with example cards
    await expect(page.getByText('Lentil Tacos')).toBeVisible();
    await expect(page.getByText('Caprese Pasta')).toBeVisible();

    // 7. Loading states are cleared
    await expect(page.getByText('Generating Ideas...')).not.toBeVisible();
    await expect(page.getByText('Generating personalized meal suggestions...')).not.toBeVisible();
  });

  test('handles input validation errors', async ({ page }) => {
    // Test short prompt
    const promptInput = page.getByLabel(/describe the dinners/i);
    await promptInput.fill('short');

    // Validation message should appear
    await expect(page.getByText('Prompt must be at least 10 characters long')).toBeVisible();

    // Generate button should be disabled
    const generateButton = page.getByRole('button', { name: /generate ideas/i });
    await expect(generateButton).toBeDisabled();

    // Test long prompt
    const longPrompt = 'a'.repeat(501);
    await promptInput.fill(longPrompt);
    await expect(page.getByText('Prompt must be 500 characters or less')).toBeVisible();
    await expect(generateButton).toBeDisabled();

    // Test valid prompt
    await promptInput.fill('I need 4 healthy meals for this week');
    await expect(page.getByText(/prompt must be/i)).not.toBeVisible();
    await expect(generateButton).toBeEnabled();
  });

  test('handles API errors gracefully', async ({ page }) => {
    // Enter prompt that triggers error
    const promptInput = page.getByLabel(/describe the dinners/i);
    await promptInput.fill('Please trigger-error in the API response');

    // Click generate
    const generateButton = page.getByRole('button', { name: /generate ideas/i });
    await generateButton.click();

    // Should show loading first
    await expect(page.getByText('Generating Ideas...')).toBeVisible();

    // Then show error
    await expect(page.getByText('Error')).toBeVisible();
    await expect(page.getByText('OpenAI API error occurred')).toBeVisible();

    // Loading state should be cleared
    await expect(page.getByText('Generating Ideas...')).not.toBeVisible();
  });

  test('clears previous errors on new successful request', async ({ page }) => {
    // First, trigger an error
    const promptInput = page.getByLabel(/describe the dinners/i);
    await promptInput.fill('Please trigger-error in the response');
    
    const generateButton = page.getByRole('button', { name: /generate ideas/i });
    await generateButton.click();

    // Wait for error to appear
    await expect(page.getByText('OpenAI API error occurred')).toBeVisible();

    // Clear and enter valid prompt
    await promptInput.fill('I need 4 quick vegetarian meals');
    await generateButton.click();

    // Error should be cleared and success should show
    await expect(page.getByText('OpenAI API error occurred')).not.toBeVisible();
    await expect(page.getByText('Mediterranean Quinoa Bowl')).toBeVisible();
  });

  test('character counter updates correctly', async ({ page }) => {
    const promptInput = page.getByLabel(/describe the dinners/i);
    
    // Initially shows 0/500
    await expect(page.getByText('0/500')).toBeVisible();

    // Type some text
    await promptInput.fill('Hello world');
    await expect(page.getByText('11/500')).toBeVisible();

    // Clear and type longer text
    await promptInput.fill('I need several healthy meals for this week');
    await expect(page.getByText('42/500')).toBeVisible();
  });

  test('preserves response formatting', async ({ page }) => {
    const promptInput = page.getByLabel(/describe the dinners/i);
    await promptInput.fill('I need meal suggestions with detailed formatting');

    const generateButton = page.getByRole('button', { name: /generate ideas/i });
    await generateButton.click();

    // Wait for response
    await expect(page.getByText('AI Meal Suggestions')).toBeVisible();

    // Check that formatting is preserved (bullet points, line breaks, etc.)
    await expect(page.getByText('1. **Mediterranean Quinoa Bowl**')).toBeVisible();
    await expect(page.getByText('- Quinoa with cucumber, tomatoes, olives, and feta')).toBeVisible();
    await expect(page.getByText('- Prep time: 15 minutes')).toBeVisible();
  });

  test('button states work correctly during generation', async ({ page }) => {
    const promptInput = page.getByLabel(/describe the dinners/i);
    await promptInput.fill('I need 4 meals for the week');

    const generateButton = page.getByRole('button', { name: /generate ideas/i });
    
    // Button should be enabled initially
    await expect(generateButton).toBeEnabled();

    // Click generate
    await generateButton.click();

    // Button should be disabled and show loading text
    await expect(page.getByRole('button', { name: /generating ideas/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /generating ideas/i })).toBeDisabled();

    // After response, button should be enabled again but not visible (showGrid = true)
    await expect(page.getByText('Mediterranean Quinoa Bowl')).toBeVisible();
    await expect(page.getByRole('button', { name: /generate ideas/i })).not.toBeVisible();
  });
});