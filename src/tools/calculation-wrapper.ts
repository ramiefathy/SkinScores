import type { CalculationResult, Tool, InputValue } from './types';

/**
 * Wraps a calculation function with error handling and validation
 */
export function safeCalculation(
  calculationFn: (inputs: Record<string, InputValue>) => CalculationResult,
  toolName: string
): (inputs: Record<string, InputValue>) => CalculationResult {
  return (inputs: Record<string, InputValue>) => {
    try {
      // Pre-validation: ensure inputs is an object
      if (!inputs || typeof inputs !== 'object') {
        return {
          score: 'Error',
          interpretation: 'Invalid input data provided',
          details: { error: 'Input must be an object' },
        };
      }

      // Call the original calculation function
      const result = calculationFn(inputs);

      // Post-validation: ensure result has required fields
      if (!result || typeof result !== 'object') {
        return {
          score: 'Error',
          interpretation: 'Calculation produced invalid result',
          details: { error: 'Result must be an object' },
        };
      }

      // Validate score
      if (result.score === undefined || result.score === null) {
        return {
          score: 'Error',
          interpretation: 'Calculation failed to produce a score',
          details: { error: 'Score is required' },
        };
      }

      // Check for numeric score bounds
      if (typeof result.score === 'number') {
        if (!isFinite(result.score)) {
          return {
            score: 'Error',
            interpretation: 'Calculation produced invalid numeric result',
            details: { error: `Score is ${result.score}` },
          };
        }
        // Round to reasonable precision to avoid floating point issues
        result.score = Math.round(result.score * 100) / 100;
      }

      // Ensure interpretation exists
      if (!result.interpretation) {
        result.interpretation = 'No interpretation available';
      }

      return result;
    } catch (error) {
      console.error(`Error in ${toolName} calculation:`, error);
      return {
        score: 'Error',
        interpretation: `Calculation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          tool: toolName,
        },
      };
    }
  };
}

/**
 * Validates numeric input and provides safe defaults
 */
export function safeNumber(value: InputValue, defaultValue: number = 0): number {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Validates array access and provides safe defaults
 */
export function safeArrayAccess<T>(arr: T[], index: number, defaultValue: T): T {
  if (!Array.isArray(arr) || index < 0 || index >= arr.length) {
    return defaultValue;
  }
  return arr[index];
}

/**
 * Safe division with zero check
 */
export function safeDivide(numerator: number, denominator: number, defaultValue: number = 0): number {
  if (denominator === 0) {
    return defaultValue;
  }
  return numerator / denominator;
}

/**
 * Wraps a tool with safe calculation logic
 */
export function wrapToolCalculation(tool: Tool): Tool {
  return {
    ...tool,
    calculationLogic: safeCalculation(tool.calculationLogic, tool.name),
  };
}