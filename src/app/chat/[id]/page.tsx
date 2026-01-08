'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  model: string;
  messages: Message[];
}

export default function ConversationPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = params.id as string;

  const [selectedModel, setSelectedModel] = useState('google/gemini-2.0-flash-exp:free');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchConversation = async () => {
      try {
        const res = await fetch(`/api/conversations/${conversationId}`);
        if (!isMounted) return;
        
        if (res.ok) {
          const data = await res.json();
          setConversation(data);
          setSelectedModel(data.model);
        } else if (res.status === 404) {
          router.push('/chat');
        }
      } catch (error) {
        console.error('Failed to fetch conversation:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchConversation();
    
    return () => { isMounted = false; };
  }, [conversationId, router]);

  const handleModelChange = async (model: string) => {
    setSelectedModel(model);
    // Update conversation model
    if (conversationId) {
      await fetch(`/api/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model }),
      });
    }
  };

  const handleNewChat = () => {
    router.push('/chat');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar
          currentConversationId={conversationId}
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
          onNewChat={handleNewChat}
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentConversationId={conversationId}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        onNewChat={handleNewChat}
      />
      <main className="flex-1 flex flex-col">
        <ChatInterface
          key={conversationId}
          conversationId={conversationId}
          initialMessages={conversation?.messages || []}
          selectedModel={selectedModel}
        />
      </main>
    </div>
  );
}
