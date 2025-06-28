import { Page } from '@playwright/test';

/**
 * Helper functions for E2E tests
 */

export async function fillPromptAndGenerate(page: Page, prompt: string) {
  const promptInput = page.getByLabel(/describe the dinners/i);
  await promptInput.fill(prompt);
  
  const generateButton = page.getByRole('button', { name: /generate ideas/i });
  await generateButton.click();
}

export async function waitForAIResponse(page: Page) {
  await page.waitForSelector('[data-testid="ai-response-success"]', {
    state: 'visible',
    timeout: 10000,
  });
}

export async function waitForError(page: Page) {
  await page.waitForSelector('[data-testid="ai-response-error"]', {
    state: 'visible',
    timeout: 5000,
  });
}

export function mockSuccessfulAPIResponse(prompt: string) {
  return {
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      message: `Here are 4 meal suggestions for: "${prompt}"\n\n1. Healthy Option\n2. Quick Option\n3. Budget Option\n4. Comfort Food`
    }),
  };
}

export function mockAPIError(errorMessage: string, status = 500) {
  return {
    status,
    contentType: 'application/json',
    body: JSON.stringify({ error: errorMessage }),
  };
}