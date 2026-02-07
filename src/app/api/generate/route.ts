import { NextRequest, NextResponse } from 'next/server';
import { generatePitchDeck, PitchDeckData } from '@/lib/slides';

export async function POST(request: NextRequest) {
  try {
    const data: PitchDeckData = await request.json();

    // Validate required fields
    const required = ['companyName', 'tagline', 'problem', 'solution', 'market', 'businessModel', 'traction', 'team', 'askAmount'];
    for (const field of required) {
      if (!data[field as keyof PitchDeckData]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const result = await generatePitchDeck(data);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate pitch deck' },
      { status: 500 }
    );
  }
}
