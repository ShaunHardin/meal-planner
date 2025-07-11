// Shared JSON schema for OpenAI API calls
export const MEAL_JSON_SCHEMA = {
  type: "object",
  properties: {
    meals: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          day: { 
            type: "string", 
            enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] 
          },
          name: { type: "string" },
          description: { type: "string" },
          prepMinutes: { type: "number" },
          cookMinutes: { type: "number" },
          ingredients: {
            type: "array",
            items: {
              type: "object",
              properties: {
                item: { type: "string" },
                quantity: { type: "string" }
              },
              required: ["item", "quantity"],
              additionalProperties: false
            },
            minItems: 1
          },
          steps: {
            type: "array",
            items: { type: "string" },
            minItems: 1
          }
        },
        required: ["id", "day", "name", "description", "prepMinutes", "cookMinutes", "ingredients", "steps"],
        additionalProperties: true
      }
    }
  },
  required: ["meals"],
  additionalProperties: false
} as const;

// Optimized instructions for faster response
export const MEAL_INSTRUCTIONS = "You are an expert meal-planning engine. Return ONLY JSON that matches the schema. Be concise but complete. Each meal needs: unique ID, day, name, description, prep/cook minutes, ingredients list, and cooking steps. You may optionally add a 'tags' array with relevant descriptive tags.";