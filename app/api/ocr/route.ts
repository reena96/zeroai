import { OpenAI } from 'openai';
import { NextRequest } from 'next/server';

// Initialize OpenAI client (same instance pattern as /api/chat)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image || typeof image !== 'string') {
      return Response.json(
        { success: false, error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Validate API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { success: false, error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    console.log('[OCR] Processing image with GPT-4 Vision...');

    // Call GPT-4 Vision API to extract math problem
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract the math problem from this image. Return only the problem text, no explanations or additional commentary. If there are multiple problems, extract all of them separated by line breaks.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const extractedText = response.choices[0]?.message?.content || '';

    if (!extractedText.trim()) {
      return Response.json(
        {
          success: false,
          error: "Couldn't read image clearly. Please try typing the problem or upload a clearer photo.",
        },
        { status: 400 }
      );
    }

    console.log('[OCR] Successfully extracted text:', extractedText);

    return Response.json({
      success: true,
      data: { problem: extractedText.trim() },
    });
  } catch (error: any) {
    console.error('[OCR] Error:', error);

    // Handle specific error types
    if (error?.status === 401) {
      return Response.json(
        { success: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }

    if (error?.status === 429) {
      return Response.json(
        { success: false, error: 'Rate limit exceeded. Please try again in a moment.' },
        { status: 429 }
      );
    }

    return Response.json(
      {
        success: false,
        error: "Couldn't read image clearly. Please try typing the problem or upload a clearer photo.",
      },
      { status: 500 }
    );
  }
}
