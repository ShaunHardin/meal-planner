// Demo function to test with the sample prompt from requirements
export const runSamplePrompt = async () => {
  const samplePrompt = "Plan four dinners for next week (Sun-Thu, Tue is take-out). Dietary prefs: low-effort, toddler-friendly.";
  
  try {
    const response = await fetch('/api/generate-meals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: samplePrompt }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Sample meals generated:', data.meals);
      return data.meals;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Sample prompt failed:', error);
    throw error;
  }
};