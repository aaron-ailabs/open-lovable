import { NextRequest, NextResponse } from 'next/server';
import { Companion } from '@/lib/companion';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const ChatSchema = z.object({
  message: z.string().min(1),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().default([]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = ChatSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    const { message } = validation.data;
    
    // In a real implementation, this would call an LLM
    // For now, providing structured response from Companion logic
    logger.info('Companion chat request', { message });

    const response = {
      content: `I am Space. You asked: "${message}". I suggest exploring the Skill System to extend my capabilities.`,
      suggestions: [
        'space skill add supabase',
        'space audit run',
        'How does context awareness work?'
      ]
    };

    return NextResponse.json({ success: true, ...response });
  } catch (error) {
    logger.error('Companion chat failed', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
