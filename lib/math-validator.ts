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
 * Context-aware: skips explanatory sentences and incomplete expressions
 */
export function extractMathExpressions(text: string): string[] {
  const expressions: string[] = [];

  // Context indicators that suggest teaching/explanation rather than answer claims
  const contextIndicators = [
    'we have', 'we start', 'let\'s', 'to find', 'to solve', 'to isolate',
    'which simplifies', 'which equals', 'which gives', 'this becomes',
    'subtract', 'add', 'divide', 'multiply', 'first', 'then', 'next',
    'if we', 'when we', 'after'
  ];

  // Pattern 1: Equations with = sign
  const equationPattern = /(?:^|\s)([a-zA-Z0-9\s\+\-\*\/\(\)\^\.]+=[a-zA-Z0-9\s\+\-\*\/\(\)\^\.]+)(?:\s|$|[,;.])/g;
  let match;
  while ((match = equationPattern.exec(text)) !== null) {
    let expr = match[1].trim();

    // Clean trailing punctuation
    expr = expr.replace(/[.,;:!?]+$/, '');

    // Skip if expression ends with an operator (incomplete)
    if (/[\+\-\*\/=]\s*$/.test(expr)) {
      continue;
    }

    // Skip if expression starts with an operator (malformed)
    if (/^\s*[\+\-\*\/=]/.test(expr)) {
      continue;
    }

    // Get context around the match to check if it's explanatory
    const startPos = match.index;
    const contextStart = Math.max(0, startPos - 30);
    const contextBefore = text.substring(contextStart, startPos).toLowerCase();

    // Skip if preceded by context indicators (teaching/explanation)
    const hasContextIndicator = contextIndicators.some(indicator =>
      contextBefore.includes(indicator)
    );

    if (hasContextIndicator) {
      continue;
    }

    expressions.push(expr);
  }

  // Pattern 2: Final answer statements (e.g., "So, x = 4")
  const finalAnswerPattern = /(?:so|therefore|thus|answer is|result is|x\s*=|solution is)\s*[:.]?\s*([a-zA-Z0-9\s\+\-\*\/\(\)\^\.]+)/gi;
  while ((match = finalAnswerPattern.exec(text)) !== null) {
    let expr = match[1].trim();

    // Clean trailing punctuation
    expr = expr.replace(/[.,;:!?]+$/, '');

    // Only include if it looks like a complete expression
    if (expr.length > 0 && !/[\+\-\*\/=]\s*$/.test(expr)) {
      expressions.push(expr);
    }
  }

  // Deduplicate expressions
  return [...new Set(expressions)];
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

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

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
    // Handle timeout/abort specifically
    if (error.name === 'AbortError') {
      return {
        isValid: false,
        error: 'Wolfram Alpha request timed out (5s)',
        method: 'wolfram',
        expression: query,
      };
    }

    return {
      isValid: false,
      error: error.message || 'Wolfram Alpha request failed',
      method: 'wolfram',
      expression: query,
    };
  }
}

/**
 * Validate mathematical expressions using mathjs only (fast, local)
 * Wolfram Alpha removed for MVP - was causing 15+ second delays on every request
 */
export async function validateMathExpression(
  expression: string,
  useWolframFallback: boolean = false // Kept for API compatibility but ignored
): Promise<MathValidationResult> {
  // Use mathjs only - fast and sufficient for catching numerical errors
  // Socratic prompts prevent direct answers anyway, so validation rarely needed
  return validateWithMathJS(expression);
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

/**
 * Student Answer Validation Result
 */
export interface StudentAnswerValidation {
  hasAnswer: boolean; // Did we detect a potential answer?
  isCorrect: boolean | null; // null if we couldn't validate
  studentAnswer?: string; // The extracted answer
  expectedAnswer?: string; // What we calculated as correct
  validationNote?: string; // Context to inject into LLM
}

/**
 * Validate a student's answer in context
 * Detects potential answers and validates them against expected results
 * Returns validation result to inject into LLM context
 */
export function validateStudentAnswer(
  userMessage: string,
  conversationContext: string
): StudentAnswerValidation {
  // Extract potential numerical answers from user message
  // Look for patterns: standalone numbers, "y = 2", "x = 3", etc.

  const trimmed = userMessage.trim();

  // Pattern 1: Just a number (e.g., "5", "2", "-3", "0.5")
  const numberMatch = trimmed.match(/^-?\d+(\.\d+)?$/);
  if (numberMatch) {
    return {
      hasAnswer: true,
      isCorrect: null, // Need context to validate
      studentAnswer: trimmed,
      validationNote: `Student answered: ${trimmed}`,
    };
  }

  // Pattern 2: Variable assignment (e.g., "x = 3", "y = 2")
  const varMatch = trimmed.match(/^([a-z])\s*=\s*(-?\d+(\.\d+)?)$/i);
  if (varMatch) {
    const variable = varMatch[1];
    const value = varMatch[2];

    // Try to validate by checking if substitution works
    // Look in conversation for equations containing this variable
    const equationPattern = new RegExp(`([^=]+${variable}[^=]*=\\s*\\d+)`, 'i');
    const eqMatch = conversationContext.match(equationPattern);

    if (eqMatch) {
      try {
        // Extract equation like "2x + y = 8"
        const equation = eqMatch[1];
        // Substitute student's value and check
        const substituted = equation.replace(new RegExp(variable, 'gi'), value);
        const validation = validateWithMathJS(substituted);

        if (validation.result === 'true') {
          return {
            hasAnswer: true,
            isCorrect: true,
            studentAnswer: `${variable} = ${value}`,
            validationNote: `[VALIDATION: Student answered ${variable} = ${value} - CORRECT]`,
          };
        } else {
          return {
            hasAnswer: true,
            isCorrect: false,
            studentAnswer: `${variable} = ${value}`,
            validationNote: `[VALIDATION: Student answered ${variable} = ${value} - INCORRECT. Check calculation before affirming.]`,
          };
        }
      } catch (error) {
        // Couldn't validate - let LLM handle it
        return {
          hasAnswer: true,
          isCorrect: null,
          studentAnswer: `${variable} = ${value}`,
          validationNote: `Student answered: ${variable} = ${value}`,
        };
      }
    }

    return {
      hasAnswer: true,
      isCorrect: null,
      studentAnswer: `${variable} = ${value}`,
      validationNote: `Student answered: ${variable} = ${value}`,
    };
  }

  // No clear answer detected
  return {
    hasAnswer: false,
    isCorrect: null,
  };
}
