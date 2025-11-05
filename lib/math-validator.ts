import * as math from 'mathjs';

/**
 * Math Validation Result
 */
export interface MathValidationResult {
  isValid: boolean;
  result?: string | number;
  error?: string;
  method: 'mathjs' | 'wolfram' | 'skipped';
  expression?: string;
}

/**
 * Extract mathematical expressions from text
 * Looks for patterns like: "2 + 2 = 4", "x = 5", "solve 3x + 5 = 11"
 */
export function extractMathExpressions(text: string): string[] {
  const expressions: string[] = [];

  // Pattern 1: Equations with = sign
  const equationPattern = /(?:^|\s)([a-zA-Z0-9\s\+\-\*\/\(\)\^\.]+=[a-zA-Z0-9\s\+\-\*\/\(\)\^\.]+)(?:\s|$)/g;
  let match;
  while ((match = equationPattern.exec(text)) !== null) {
    expressions.push(match[1].trim());
  }

  // Pattern 2: Standalone expressions in context (e.g., "the answer is 42")
  const numberPattern = /(?:answer|result|equals|is)\s+(-?\d+(?:\.\d+)?)/gi;
  while ((match = numberPattern.exec(text)) !== null) {
    expressions.push(match[1]);
  }

  return expressions;
}

/**
 * Validate a mathematical expression using mathjs
 */
export function validateWithMathJS(expression: string): MathValidationResult {
  try {
    // Clean the expression
    const cleaned = expression.trim();

    // Try to evaluate or simplify
    let result;

    // Check if it's an equation (contains =)
    if (cleaned.includes('=')) {
      const parts = cleaned.split('=').map(p => p.trim());
      if (parts.length === 2) {
        // Evaluate both sides
        const left = math.evaluate(parts[0]);
        const right = math.evaluate(parts[1]);

        // Check if they're equal (with tolerance for floating point)
        const isEqual = Math.abs(Number(left) - Number(right)) < 0.0001;

        return {
          isValid: true,
          result: isEqual ? 'true' : 'false',
          method: 'mathjs',
          expression: cleaned,
        };
      }
    } else {
      // Just evaluate the expression
      result = math.evaluate(cleaned);

      return {
        isValid: true,
        result: typeof result === 'number' ? result : String(result),
        method: 'mathjs',
        expression: cleaned,
      };
    }

    return {
      isValid: false,
      error: 'Could not parse expression',
      method: 'mathjs',
      expression: cleaned,
    };
  } catch (error: any) {
    return {
      isValid: false,
      error: error.message || 'Invalid mathematical expression',
      method: 'mathjs',
      expression,
    };
  }
}

/**
 * Validate using Wolfram Alpha API (fallback for complex symbolic math)
 * Requires WOLFRAM_APP_ID environment variable
 */
export async function validateWithWolfram(query: string): Promise<MathValidationResult> {
  const appId = process.env.WOLFRAM_APP_ID;

  if (!appId) {
    return {
      isValid: false,
      error: 'Wolfram Alpha API key not configured',
      method: 'wolfram',
      expression: query,
    };
  }

  try {
    const url = new URL('https://api.wolframalpha.com/v2/query');
    url.searchParams.set('input', query);
    url.searchParams.set('appid', appId);
    url.searchParams.set('format', 'plaintext');
    url.searchParams.set('output', 'json');

    const response = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      return {
        isValid: false,
        error: `Wolfram API error: ${response.status}`,
        method: 'wolfram',
        expression: query,
      };
    }

    const data = await response.json();

    // Extract result from Wolfram response
    const pods = data.queryresult?.pods || [];
    const resultPod = pods.find((p: any) => p.title === 'Result' || p.title === 'Solution');

    if (resultPod && resultPod.subpods?.[0]?.plaintext) {
      return {
        isValid: true,
        result: resultPod.subpods[0].plaintext,
        method: 'wolfram',
        expression: query,
      };
    }

    return {
      isValid: false,
      error: 'No result found in Wolfram response',
      method: 'wolfram',
      expression: query,
    };
  } catch (error: any) {
    return {
      isValid: false,
      error: error.message || 'Wolfram Alpha request failed',
      method: 'wolfram',
      expression: query,
    };
  }
}

/**
 * Hybrid validation: Try mathjs first, fallback to Wolfram Alpha for complex expressions
 */
export async function validateMathExpression(
  expression: string,
  useWolframFallback: boolean = false
): Promise<MathValidationResult> {
  // First, try mathjs (fast, local)
  const mathjsResult = validateWithMathJS(expression);

  if (mathjsResult.isValid) {
    return mathjsResult;
  }

  // If mathjs fails and Wolfram fallback is enabled, try Wolfram Alpha
  if (useWolframFallback && process.env.WOLFRAM_APP_ID) {
    console.log(`[Math Validator] mathjs failed for "${expression}", trying Wolfram Alpha...`);
    return await validateWithWolfram(expression);
  }

  // Return mathjs error if no fallback
  return mathjsResult;
}

/**
 * Validate all mathematical expressions found in text
 */
export async function validateTextMath(
  text: string,
  useWolframFallback: boolean = false
): Promise<{
  expressions: string[];
  validations: MathValidationResult[];
  allValid: boolean;
}> {
  const expressions = extractMathExpressions(text);

  if (expressions.length === 0) {
    return {
      expressions: [],
      validations: [],
      allValid: true, // No math to validate means nothing invalid
    };
  }

  const validations = await Promise.all(
    expressions.map(expr => validateMathExpression(expr, useWolframFallback))
  );

  const allValid = validations.every(v => v.isValid);

  return {
    expressions,
    validations,
    allValid,
  };
}

/**
 * Log validation discrepancies for model improvement
 */
export function logValidationDiscrepancy(
  llmResponse: string,
  validation: MathValidationResult,
  context: string
): void {
  console.warn('[Math Validation Discrepancy]', {
    timestamp: new Date().toISOString(),
    context,
    llmResponse,
    validation,
    suggestion: 'Consider fine-tuning prompts or flagging for human review',
  });
}
