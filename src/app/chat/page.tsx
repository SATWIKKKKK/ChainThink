'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/chat/Sidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';

export default function ChatPage() {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState('google/gemini-2.0-flash-exp:free');

  const handleNewChat = () => {
    // Reset to new chat view (already on /chat)
    router.refresh();
  };

  const handleConversationCreated = (id: string) => {
    // Navigate to the new conversation
    router.push(`/chat/${id}`);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        onNewChat={handleNewChat}
      />
      <main className="flex-1 flex flex-col">
        <ChatInterface
          selectedModel={selectedModel}
          onConversationCreated={handleConversationCreated}
        />
      </main>
    </div>
  );
}
