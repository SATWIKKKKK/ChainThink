'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Send, Lightbulb } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  sessionId: string;
  initialMessages?: Message[];
}

export function ChatInterface({ sessionId, initialMessages = [] }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const sendMessage = async (isHintRequest: boolean = false) => {
    if (!input.trim() && !isHintRequest) return;

    const userMessage = isHintRequest ? 'I need a hint.' : input.trim();
    const tempId = Date.now().toString();

    // Add user message to UI
    const newUserMessage: Message = {
      id: tempId,
      role: 'user',
      content: userMessage,
    };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);
    setIsStreaming(true);

    try {
      const response = await fetch('/api/session/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: userMessage,
          isHintRequest,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      const assistantId = (Date.now() + 1).toString();

      // Add empty assistant message that will be streamed into
      setMessages(prev => [
        ...prev,
        { id: assistantId, role: 'assistant', content: '' },
      ]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  assistantMessage += parsed.text;
                  setMessages(prev =>
                    prev.map(msg =>
                      msg.id === assistantId
                        ? { ...msg, content: assistantMessage }
                        : msg
                    )
                  );
                }
              } catch {
                // Ignore parse errors
              }
            }
          }
        }
      }

      // Save assistant message to database
      await fetch('/api/session/save-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: assistantMessage,
        }),
      });

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-150px p-4" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Start by describing your initial thoughts or ask for guidance.</p>
            </div>
          )}
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 bg-primary">
                    <AvatarFallback className="text-primary-foreground">CT</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 bg-secondary">
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-col gap-2 p-4">
        <div className="flex w-full gap-2">
          <Textarea
            ref={textareaRef}
            placeholder="Share your thinking..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="min-h-15px resize-none"
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => sendMessage(false)}
              disabled={isLoading || !input.trim()}
              size="icon"
            >
              {isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={() => sendMessage(true)}
              disabled={isLoading}
              variant="outline"
              size="icon"
              title="Request a hint"
            >
              <Lightbulb className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center w-full">
          ChainThink won&apos;t give you answers—it&apos;ll help you think through the problem.
        </p>
      </CardFooter>
    </Card>
  );
}

//&apos; for type safety...