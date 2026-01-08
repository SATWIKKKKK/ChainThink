import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { 
  getConversation, 
  addMessage, 
  updateConversationTitle,
  generateConversationTitle 
} from '@/lib/db/queries';
import { streamChatResponse } from '@/lib/ai/openrouter';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: conversationId } = await params;
    const { message } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // Get conversation and verify ownership
    const conversation = await getConversation(conversationId, user.id);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Save user message
    await addMessage(conversationId, 'user', message);

    // Update title if this is the first message
    if (conversation.messages.length === 0) {
      const title = await generateConversationTitle(message);
      await updateConversationTitle(conversationId, title);
    }

    // Build messages for API
    const chatMessages = [
      ...conversation.messages.map((m) => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ];

    // Stream response
    const stream = await streamChatResponse(conversation.model, chatMessages);

    // Collect full response and save it
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let fullResponse = '';

    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = decoder.decode(chunk);
        controller.enqueue(chunk);

        // Parse and collect response text
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const json = JSON.parse(line.slice(6));
              if (json.text) {
                fullResponse += json.text;
              }
            } catch {
              // Ignore parse errors
            }
          }
        }
      },
      async flush() {
        // Save assistant response to database
        if (fullResponse) {
          await addMessage(conversationId, 'assistant', fullResponse);
        }
      },
    });

    const responseStream = stream.pipeThrough(transformStream);

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
