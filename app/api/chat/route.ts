import { OpenAI } from 'openai';
import { NextRequest } from 'next/server';
import { validateTextMath, logValidationDiscrepancy } from '@/lib/math-validator';
import { SOCRATIC_PROMPTS } from '@/lib/prompts';
import type { SessionMode } from '@/store/chat';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to select prompt based on session mode
function getPromptForMode(mode: SessionMode): string {
  if (!mode) return SOCRATIC_PROMPTS.homework; // Default fallback

  switch (mode) {
    case 'homework':
      return SOCRATIC_PROMPTS.homework;
    case 'exam':
      return SOCRATIC_PROMPTS.exam;
    case 'explore':
      return SOCRATIC_PROMPTS.explore;
    default:
      return SOCRATIC_PROMPTS.homework; // Fallback for any unexpected value
  }
}

export async function POST(req: NextRequest) {
  try {
    // Extract messages and sessionMode from request body
    const { messages, sessionMode } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Take last 10 messages for context (to manage token usage)
    const contextMessages = messages.slice(-10);

    // Select appropriate Socratic prompt based on session mode
    const selectedPrompt = getPromptForMode(sessionMode);

    // Add mode-aware system prompt for accurate tutoring
    const messagesWithSystem = [
      {
        role: 'system',
        content: selectedPrompt,
      },
      ...contextMessages,
    ];

    // STEP 1: Get complete response (non-streaming) for pre-validation
    console.log('[API] Generating response for pre-validation...');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messagesWithSystem,
      stream: false, // Get complete response first
      temperature: 0.3, // Lower temperature for more consistent anti-apology behavior
    });

    let responseText = completion.choices[0]?.message?.content || '';

    // STEP 2: Pre-validate the response BEFORE streaming to user
    console.log('[API] Validating response...');
    const validation = await validateTextMath(responseText, true); // Enable Wolfram fallback

    // STEP 3: Handle validation results
    if (!validation.allValid && validation.expressions.length > 0) {
      const invalidExpressions = validation.validations.filter(v => !v.isValid);

      console.warn('[Math Pre-Validation] Invalid math detected, attempting correction...', {
        totalExpressions: validation.expressions.length,
        invalidCount: invalidExpressions.length,
        expressions: invalidExpressions.map(v => ({
          expression: v.expression,
          error: v.error,
          method: v.method,
        })),
      });

      // Log discrepancies
      invalidExpressions.forEach(v => {
        logValidationDiscrepancy(responseText, v, 'Pre-validation failed');
      });

      // Only retry if we have actual answer claims that failed (not just unsolvable variables)
      const needsCorrection = invalidExpressions.some(v => {
        const expr = v.expression || '';
        // Skip retry if it's just an unsolvable variable equation (teaching context)
        const hasVariables = /[a-zA-Z]/.test(expr);
        const isEquation = expr.includes('=');
        // Only correct if it's a numerical claim or solved equation
        return !hasVariables || (isEquation && !v.error?.includes('Undefined symbol'));
      });

      if (needsCorrection) {
        // RETRY: Ask GPT-4 to correct itself
        const correctionPrompt = {
          role: 'user',
          content: `I noticed a potential error in your last response. Let me verify: ${invalidExpressions[0].expression}. Please double-check your math and provide the correct guidance.`,
        };

        const retryCompletion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [...messagesWithSystem, completion.choices[0].message, correctionPrompt],
          stream: false,
          temperature: 0.3, // Match main temperature for consistency
        });

        responseText = retryCompletion.choices[0]?.message?.content || responseText;

        // Validate retry
        const retryValidation = await validateTextMath(responseText, true);

        if (retryValidation.allValid || retryValidation.expressions.length === 0) {
          console.log('[Math Pre-Validation] ✅ Correction successful');
        } else {
          const stillInvalid = retryValidation.validations.filter(v => !v.isValid);
          // Only add warning if we still have invalid numerical claims
          const hasInvalidNumericalClaims = stillInvalid.some(v => {
            const expr = v.expression || '';
            return !/[a-zA-Z]/.test(expr); // Pure numerical expression
          });

          if (hasInvalidNumericalClaims) {
            console.error('[Math Pre-Validation] ❌ Correction failed, streaming with warning');
            responseText += '\n\n_[Note: I\'m having difficulty verifying this calculation. Please double-check this answer independently.]_';
          } else {
            console.log('[Math Pre-Validation] ⚠️ Validation inconclusive (teaching context), proceeding without warning');
          }
        }
      } else {
        console.log('[Math Pre-Validation] ⚠️ Validation failures appear to be teaching context, skipping correction');
      }
    } else if (validation.expressions.length > 0) {
      console.log('[Math Pre-Validation] ✅ All math validated:', {
        expressionCount: validation.expressions.length,
        expressions: validation.expressions,
      });
    } else {
      console.log('[Math Pre-Validation] No math expressions found in response');
    }

    // STEP 4: Stream the validated (and possibly corrected) response to client
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // Stream character by character for smooth UX
          for (let i = 0; i < responseText.length; i++) {
            controller.enqueue(encoder.encode(responseText[i]));
            // Small delay for streaming effect
            await new Promise(resolve => setTimeout(resolve, 10));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    // Return streaming response
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    console.error('OpenAI API error:', error);

    // Handle specific error types
    if (error?.status === 401) {
      return new Response(
        JSON.stringify({ error: 'Invalid API key' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Failed to generate response' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
