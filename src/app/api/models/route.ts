import { NextResponse } from 'next/server';
import { POPULAR_MODELS } from '@/lib/ai/openrouter';

// GET - Get available models
export async function GET() {
  try {
    // Return popular models (curated list)
    // You could also fetch from OpenRouter API: https://openrouter.ai/api/v1/models
    return NextResponse.json(POPULAR_MODELS);
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
