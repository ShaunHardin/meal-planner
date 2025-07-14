import { Meal } from '../types/meal';

export interface GroceryItem {
  item: string;
  quantity: string;
  originalQuantities: string[];
}

interface ParsedQuantity {
  amount: number;
  unit: string;
  originalText: string;
}

const UNIT_CONVERSIONS: Record<string, string> = {
  'tbsp': 'tablespoon',
  'tablespoons': 'tablespoon',
  'tsp': 'teaspoon',
  'teaspoons': 'teaspoon',
  'cups': 'cup',
  'c': 'cup',
  'lbs': 'lb',
  'pounds': 'lb',
  'pound': 'lb',
  'oz': 'ounce',
  'ounces': 'ounce',
  'cloves': 'clove',
  'cans': 'can',
  'medium': 'medium',
  'large': 'large',
  'small': 'small',
  'whole': 'whole',
  'sliced': 'sliced',
  'cooked': 'cooked',
};

function parseQuantity(quantity: string): ParsedQuantity | null {
  const normalizedQuantity = quantity.toLowerCase().trim();
  
  // Match patterns like "2 cups", "1/2 cup", "1.5 tbsp", "3 cloves"
  const match = normalizedQuantity.match(/^(\d+(?:\/\d+)?(?:\.\d+)?)?\s*(.+)$/);
  
  if (!match) {
    return null;
  }
  
  const [, amountStr, unitStr] = match;
  
  if (!amountStr) {
    // No number found, treat as non-measurable item
    return {
      amount: 1,
      unit: normalizedQuantity,
      originalText: quantity
    };
  }
  
  // Parse fractions and decimals
  let amount: number;
  if (amountStr.includes('/')) {
    const [numerator, denominator] = amountStr.split('/').map(Number);
    amount = numerator / denominator;
  } else {
    amount = parseFloat(amountStr);
  }
  
  const normalizedUnit = UNIT_CONVERSIONS[unitStr.trim()] || unitStr.trim();
  
  return {
    amount,
    unit: normalizedUnit,
    originalText: quantity
  };
}

function combineQuantities(quantities: ParsedQuantity[]): string {
  if (quantities.length === 0) return '';
  if (quantities.length === 1) return quantities[0].originalText;
  
  // Group by unit
  const unitGroups: Record<string, ParsedQuantity[]> = {};
  const nonMeasurable: ParsedQuantity[] = [];
  
  for (const qty of quantities) {
    // Check if this looks like a measurable quantity
    if (qty.amount === 1 && !qty.unit.match(/^(cup|tablespoon|teaspoon|lb|ounce|clove|can)s?$/)) {
      nonMeasurable.push(qty);
    } else {
      if (!unitGroups[qty.unit]) {
        unitGroups[qty.unit] = [];
      }
      unitGroups[qty.unit].push(qty);
    }
  }
  
  const combinedParts: string[] = [];
  
  // Combine measurable quantities
  for (const [unit, qtyList] of Object.entries(unitGroups)) {
    const totalAmount = qtyList.reduce((sum, qty) => sum + qty.amount, 0);
    
    // Format the combined amount
    let formattedAmount: string;
    if (totalAmount === Math.floor(totalAmount)) {
      formattedAmount = totalAmount.toString();
    } else {
      // Try to convert to fraction if it makes sense
      const fraction = decimalToFraction(totalAmount);
      formattedAmount = fraction || totalAmount.toFixed(2);
    }
    
    const unitDisplay = totalAmount === 1 ? unit : (unit + 's');
    combinedParts.push(`${formattedAmount} ${unitDisplay}`);
  }
  
  // Add non-measurable items
  if (nonMeasurable.length > 0) {
    const nonMeasurableText = nonMeasurable.map(qty => qty.originalText).join(', ');
    combinedParts.push(nonMeasurableText);
  }
  
  return combinedParts.join(' + ');
}

function decimalToFraction(decimal: number): string | null {
  const commonFractions: Record<string, number> = {
    '1/4': 0.25,
    '1/3': 0.333,
    '1/2': 0.5,
    '2/3': 0.667,
    '3/4': 0.75,
    '1/8': 0.125,
    '3/8': 0.375,
    '5/8': 0.625,
    '7/8': 0.875,
  };
  
  const tolerance = 0.01;
  for (const [fraction, value] of Object.entries(commonFractions)) {
    if (Math.abs(decimal - value) < tolerance) {
      return fraction;
    }
  }
  
  return null;
}

export function createGroceryList(meals: Meal[]): GroceryItem[] {
  const ingredientMap = new Map<string, string[]>();
  
  // Collect all ingredients, grouping by item name
  for (const meal of meals) {
    for (const ingredient of meal.ingredients) {
      const normalizedItem = ingredient.item.toLowerCase().trim();
      if (!ingredientMap.has(normalizedItem)) {
        ingredientMap.set(normalizedItem, []);
      }
      ingredientMap.get(normalizedItem)!.push(ingredient.quantity);
    }
  }
  
  // Convert to grocery items with combined quantities
  const groceryItems: GroceryItem[] = [];
  
  for (const [item, quantities] of ingredientMap) {
    const parsedQuantities = quantities
      .map(parseQuantity)
      .filter((parsed): parsed is ParsedQuantity => parsed !== null);
    
    const combinedQuantity = combineQuantities(parsedQuantities);
    
    groceryItems.push({
      item: item.charAt(0).toUpperCase() + item.slice(1), // Capitalize first letter
      quantity: combinedQuantity,
      originalQuantities: quantities
    });
  }
  
  // Sort alphabetically by item name
  return groceryItems.sort((a, b) => a.item.localeCompare(b.item));
}